import React from 'react';
import { YAxis, LineSeries, FlexibleWidthXYPlot, AbstractSeries, MarkSeries } from 'react-vis';

const getAverageLineData = (grades, average) => {
    const averageLineData = grades.map((grade, index) => {
        return { x: index, y: grade.averageUntil || grade.grade }
    })
    averageLineData.push({ x: averageLineData.length, y: average });
    return averageLineData;
}

export default class GraphView extends React.Component {



    render() {

        const { grades } = this.props;

        if (!grades || grades.length < 1) {
            return <div />
        }

        const length = grades.length;


        return (
            <div className="candlestick-example">
                <div className="chart">
                    <FlexibleWidthXYPlot animation yDomain={[4, 1]} height={300}>

                        <YAxis />
                        <LineSeries color="#12939A" data={[{ x: 0, y: this.props.min }, { x: length, y: this.props.min }]} />
                        <LineSeries
                            color="#FF9833"
                            className="dashed-example-line"
                            data={[{ x: 0, y: this.props.average }, { x: length, y: this.props.average }]}
                        />
                        <LineSeries
                            color="#1A3177"
                            className="dashed-example-line"
                            opacity={0.3}
                            data={[{ x: 0, y: this.props.max }, { x: length, y: this.props.max }]}
                        />
                        <LineSeries
                            curve={'curveMonotoneX'}
                            strokeDasharray={'7, 3'}
                            style={{
                                strokeLinejoin: 'round',
                                strokeWidth: 4,
                                mark: { stroke: 'white' }
                            }}
                            data={getAverageLineData(grades, this.props.average)} />
                        <MarkSeries data={grades.map((grade, index) => {
                            return { x: index + 1, y: grade.grade }
                        })} stroke="white"
                            opacityType="category"
                            opacity="0.7" />
                    </FlexibleWidthXYPlot>
                </div>
            </div>)
    }
}
