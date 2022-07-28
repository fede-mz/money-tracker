import React, {useMemo} from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {PieChart, Pie, Tooltip, Cell} from 'recharts';
import * as _ from 'lodash';
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

    const chartData = useMemo(() => {
            const data = byCategory?.data?.outcomes?.byCategories?.map( (d,i) => ({
                value: Math.abs(d.amountCents),
                name: `${d.category.title}: ${d.amount}`,
                label: d.category.title,
                color: getColorForChart(i)
            }));
            return _.sortBy(data,['label']);
        }, [byCategory?.data]);

    return (
        <div>
            <div className="row p-3 bg-secondary text-white rounded">
                <div className="col-md-12">
                    Outcomes
                </div>
            </div>
            {byCategory?.data?.outcomes?.byCategories &&
                <div>
                    <PieChart width={400} height={300}>
                        <Pie dataKey="value"
                             data={chartData}
                             innerRadius={40}
                             outerRadius={80}
                             paddingAngle={5}
                             label={data => data.label}
                        >
                            {chartData.map((data, i) => (
                                <Cell key={`data-${i}`} fill={data.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip/>} />
                    </PieChart>
                    <p className="text-secondary">
                        Total Incomes: <span className="text-success">{byCategory.data.incomes.total}</span>
                    </p>
                    <p className="text-secondary">
                        Total Outcomes: <span className="text-danger">{byCategory.data.outcomes.total}</span>
                    </p>
                    <p className="text-secondary mt-2">
                        Balance: <span className={byCategory.data.balanceCents < 0 ? "text-danger" : "text-success"}>{byCategory.data.balance}</span>
                    </p>
                </div>
            }
            {byCategory.loading && <div className="spinner-border spinner-border-sm"></div>}
            {byCategory.error && <div className="text-danger">Error loading cash flow: {byCategory.error.message}</div>}
        </div>
    );
}

const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-light p-2">
                {payload[0].name}
            </div>
        );
    }

    return null;
};

export { Outcomes };