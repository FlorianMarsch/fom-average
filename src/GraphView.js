import React from 'react';
import { YAxis, LineSeries, FlexibleWidthXYPlot, AbstractSeries, MarkSeries } from 'react-vis';

const getAverageLineData = (grades, average) => {
    const averageLineData = grades.map((grade, index) => {
        return { x: index, y: grade.averageUntil || grade.grade }
    })
    averageLineData.push({ x: averageLineData.length, y: average });
    return averageLineData;
}



/**
 * Generate random random for candle stick chart
 * @param {number} total - Total number of values.
 * @returns {Array} Array of data.
 */
function buildRandomBinnedData(total) {
    const result = Array(total)
        .fill(0)
        .map((x, i) => {
            const values = [
                Math.random(),
                Math.random(),
                Math.random(),
                Math.random()
            ]
                .sort()
                .map(d => Math.floor(d * 100));
            const y = (values[2] + values[1]) / 2;
            return {
                x: i,
                y,
                yHigh: values[3],
                yOpen: values[2],
                yClose: values[1],
                yLow: values[0],
                color: y < 25 ? '#EF5D28' : '#12939A',
                opacity: y > 75 ? 0.7 : 1
            };
        });
    return result;
}

export default class GraphView extends React.Component {



    render() {

        const { grades } = this.props;

        if (!grades || grades.length < 1) {
            return <div />
        }

        const length = grades.length;

        const data = grades.sort((a, b) => {
            return new Date(a.archived).getTime() - new Date(b.archived).getTime()
        })


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




const predefinedClassName =
    'rv-xy-plot__series rv-xy-plot__series--candlestick';

class Candlestick extends AbstractSeries {
    render() {
        const { className, data, marginLeft, marginTop } = this.props;
        if (!data) {
            return null;
        }

        const xFunctor = this._getAttributeFunctor('x');
        const yFunctor = this._getAttributeFunctor('y');
        const strokeFunctor =
            this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
        const fillFunctor =
            this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');
        const opacityFunctor = this._getAttributeFunctor('opacity');

        const distance = Math.abs(xFunctor(data[1]) - xFunctor(data[0])) * 0.2;

        return (
            <g
                className={`${predefinedClassName} ${className}`}
                transform={`translate(${marginLeft},${marginTop})`}
            >
                {data.map((d, i) => {
                    const xTrans = xFunctor(d);
                    // Names of values borrowed from here https://en.wikipedia.org/wiki/Candlestick_chart
                    const yHigh = yFunctor({ ...d, y: d.yHigh });
                    const yOpen = yFunctor({ ...d, y: d.yOpen });
                    const yClose = yFunctor({ ...d, y: d.yClose });
                    const yLow = yFunctor({ ...d, y: d.yLow });

                    const lineAttrs = {
                        stroke: strokeFunctor && strokeFunctor(d)
                    };

                    const xWidth = distance * 2;
                    return (
                        <g
                            transform={`translate(${xTrans})`}
                            opacity={opacityFunctor ? opacityFunctor(d) : 1}
                            key={i}
                            onClick={e => this._valueClickHandler(d, e)}
                            onMouseOver={e => this._valueMouseOverHandler(d, e)}
                            onMouseOut={e => this._valueMouseOutHandler(d, e)}
                        >
                            <line
                                x1={-xWidth}
                                x2={xWidth}
                                y1={yHigh}
                                y2={yHigh}
                                {...lineAttrs}
                            />
                            <line x1={0} x2={0} y1={yHigh} y2={yLow} {...lineAttrs} />
                            <line
                                x1={-xWidth}
                                x2={xWidth}
                                y1={yLow}
                                y2={yLow}
                                {...lineAttrs}
                            />
                            <rect
                                x={-xWidth}
                                width={Math.max(xWidth * 2, 0)}
                                y={yOpen}
                                height={Math.abs(yOpen - yClose)}
                                fill={fillFunctor && fillFunctor(d)}
                            />
                        </g>
                    );
                })}
            </g>
        );
    }
}

