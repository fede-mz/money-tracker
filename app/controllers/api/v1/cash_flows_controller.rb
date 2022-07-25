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

end
