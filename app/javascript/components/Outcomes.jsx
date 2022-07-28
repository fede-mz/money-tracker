import React, {useMemo} from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RadialChart, LabelSeries } from "react-vis";
import { useCashFlowsSelector, cashFlowsActions } from './../store';
import {getColorForChart} from "../helpers";


function Outcomes({ dateSelected, currency }) {
    const dispatch = useDispatch();
    const { byCategory } = useCashFlowsSelector();

    useEffect(() => {
        const fromDate = dateSelected.clone().startOf('month').format('YYYY-MM-DD');
        const toDate = dateSelected.clone().endOf('month').format('YYYY-MM-DD');
        dispatch(cashFlowsActions.getByCategory({ fromDate, toDate, currency }));
    }, [dispatch, dateSelected, currency]);

    const chartData = useMemo(() => byCategory?.data?.outcomes?.byCategories?.map( (d,i) => ({
            angle: Math.abs(d.amountCents),
            label: d.category.title,
            subLabel: d.amount,
            color: getColorForChart(i)
        })),
        [byCategory?.data]);

    return (
        <div>
            <div className="row p-3 bg-secondary text-white rounded">
                <div className="col-md-12">
                    Outcomes
                </div>
            </div>
            {byCategory?.data?.outcomes?.byCategories &&
                <div className="mt-3 text-center">
                    <RadialChart
                        colorType="literal"
                        innerRadius={50}
                        radius={170}
                        data={chartData}
                        color={d => d.color}
                        width={400}
                        height={400}
                        animation={"gentle"}
                        showLabels={true}
                    />
                    <p className="text-secondary mt-2">
                        {byCategory.data.outcomes.total}
                    </p>
                </div>
            }
            {byCategory.loading && <div className="spinner-border spinner-border-sm"></div>}
            {byCategory.error && <div className="text-danger">Error loading cash flow: {byCategory.error.message}</div>}
        </div>
    );
}

export { Outcomes };