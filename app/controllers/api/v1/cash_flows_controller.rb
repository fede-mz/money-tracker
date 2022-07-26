class Api::V1::CashFlowsController < ApplicationController

  def index
    from_date = Date.current.beginning_of_month
    to_date = Date.current.end_of_month
    if params[:date].present?
      date_param = Date.parse(params[:date])
      if date_param.is_a?(Date)
        from_date = date_param.beginning_of_month
        to_date = date_param.end_of_month
      end
    end
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

    if @cash_flow.save
      render "show"
    else
      render json: { errors: @cash_flow.errors }, status: :unprocessable_entity
    end

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
end
