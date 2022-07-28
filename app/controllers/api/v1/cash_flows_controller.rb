class Api::V1::CashFlowsController < ApplicationController
  load_and_authorize_resource only: [:destroy]

  # This action can receive params: from_date, to_date
  #  if not, date range is set for this month
  def index
    from_date, to_date = params_date_range
    @cash_flows = CashFlow.includes(:category)
                          .for_current_user(@current_user)
                          .in_range(from_date, to_date)
                          .order(flow_date: :asc, id: :asc)
  end

  def create
    account = @current_user.accounts.find(cash_flow_params[:account_id])
    category = @current_user.categories.find(cash_flow_params[:category_id])
    date = Date.parse(cash_flow_params[:flow_date]) if cash_flow_params[:flow_date]
    amount = Money.new(cash_flow_params[:amount].to_f * 100, account.currency) if cash_flow_params[:amount]

    saved = false
    ActiveRecord::Base.transaction do
      @cash_flow = CashFlow.new(
        account: account,
        category: category,
        description: cash_flow_params[:description],
        flow_date: date,
        amount: amount,
        is_balance: cash_flow_params[:is_balance]
      )

      cash_flow_params[:tags]&.each do |tag|
        @cash_flow.tags << Tag.find_or_create_by!(
          user: @current_user, title: tag[:title]
        )
      end

      saved = @cash_flow.save
    end
    if saved
      render "show"
    else
      render json: { errors: @cash_flow.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    id = @cash_flow.id
    destroyed = false
    ActiveRecord::Base.transaction do
      destroyed = @cash_flow.destroy
    end
    if destroyed
      render json: { cashFlow: { id: id } }, status: :ok
    else
      render json: { error: "cash flow couldn't be deleted" }, status: :unprocessable_entity
    end
  end

  # cash flow by category
  # This action can receive params: from_date, to_date and currency,
  #  if not, date range is set for this month and currency to the primary_currency
  def by_category
    from_date, to_date = params_date_range
    @currency = params[:currency].present? ? params[:currency] : @current_user.primary_currency
    @outcomes = CashFlow.outcomes
                        .for_current_user(@current_user)
                        .in_range(from_date, to_date)
                        .where(amount_currency: @currency)
                        .group(:category_id)
                        .sum(:amount_cents)
    @incomes = CashFlow.incomes
                       .for_current_user(@current_user)
                       .in_range(from_date, to_date)
                       .where(amount_currency: @currency)
                       .group(:category_id)
                       .sum(:amount_cents)
    @balance = Money.new(@incomes.map(&:second).sum + @outcomes.map(&:second).sum, @currency)
  end

  private
  def cash_flow_params
    params.require(:cash_flow).permit(:account_id,
                                      :category_id,
                                      :description,
                                      :flow_date,
                                      :amount,
                                      :is_balance,
                                      tags: [:title])
  end

  # return params or default values for from_date and to_date
  # default values are a range for this (current) month
  def params_date_range
    from_date = Date.current.beginning_of_month
    to_date = Date.current.end_of_month
    if params[:from_date].present?
      date_param = Date.parse(params[:from_date])
      if date_param.is_a?(Date)
        from_date = date_param
      end
    end
    if params[:to_date].present?
      date_param = Date.parse(params[:to_date])
      if date_param.is_a?(Date)
        to_date = date_param
      end
    end
    [from_date, to_date]
  end
end
