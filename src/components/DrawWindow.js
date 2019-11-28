import React from 'react';
import css from './DrawWindow.module.css';
import {SketchPicker} from 'react-color';

export class DrawWindow extends React.Component {

    state = {
        stringAsArray: [],
        objForInnerHTML: {__html: ""},
        w: ``, h: ``,
        x1: ``, y1: ``, x2: ``, y2: ``,
        rx1: ``, ry1: ``, rx2: ``, ry2: ``,
        bx: ``, by: ``, color: ``,
        error: ``,
        firstTimePainted: false,
    };


    // create myself canvas
    createCanvas = async (w = 0, h = 0) => {

        if (w !== `` && h !== ``) {
            await this.setState({firstTimePainted: false});
            if (w !== `` && h !== ``) {
                let newW = w + 2;
                let newH = h + 2;

                let conwas = ``;

                // paint canvas
                for (let x = 0; x < newH; x++) {
                    // paint top/bottom
                    if (x === 0 || x === newH - 1) {
                        for (let y = 0; y < newW; y++) {
                            conwas += `-`;
                        }
                        if (x === newH - 1) conwas += ``;
                        else conwas += `<br/>`;
                    }
                    // paint other string
                    else {
                        for (let y = 0; y < newW; y++) {
                            // paint first/last string
                            if (y === 0 || y === newW - 1) conwas += `|`;
                            // paint other string
                            else conwas += `&#8194;`
                        }
                        conwas += `<br/>`
                    }
                }

                // save as array for redrawing
                let stringAsArray = conwas.split(`<br/>`);
                for (let i = 0; i < stringAsArray.length; i++) {
                    if (i === 0 || i === stringAsArray.length - 1) {
                        stringAsArray[i] = stringAsArray[i].split(``);
                    } else {
                        let left = `|`;
                        let right = `|`;
                        let otherPart = stringAsArray[i]
                            .split('')
                            .filter(item => item !== `|`)
                            .join('').split(`;`)
                            .filter(item => item !== ``)
                            .map(item => item + `;`);
                        stringAsArray[i] = [left, ...otherPart, right];
                    }
                }


                await this.setState({stringAsArray: stringAsArray, objForInnerHTML: {__html: "" + conwas + ""}});

                // paint white canvas
                await this.bucketFill(
                    this.state.w, this.state.h,
                    this.state.x1, this.state.y1, this.state.x2, this.state.y2,
                    this.state.rx1, this.state.ry1, this.state.rx2, this.state.ry2,
                    1, 1, `white`
                )
            }
        } else {
            this.setState({error: `Поля Create Canvas не заполнены.`})
        }
    };

    drawOfLine = async (
        w = 0, h = 0,
        x1 = 0, y1 = 0, x2 = 0, y2 = 0) => {

        if (this.state.stringAsArray.length > 1) {
            if (x1 !== `` && y1 !== `` && x2 !== `` && y2 !== ``) {

                let newW = w + 2;
                let newH = h + 2;

                let conwas = this.state.stringAsArray;

                // paint canvas
                for (let x = 0; x < newH; x++) {
                    // check top/bottom
                    if (x !== 0 || x !== newH - 1) {
                        for (let y = 0; y < newW; y++) {
                            // check first/last string
                            if (y !== 0 || y !== newW - 1) {
                                // horizontal line is drawn
                                if (y1 === y2 && x === y1 && y >= x1 && y <= x2) {
                                    conwas[x][y] = `x`;
                                }
                                // vertical line is drawn
                                else if (x1 === x2 && y === x1 && x >= y1 && x <= y2) {
                                    conwas[x][y] = `x`;
                                }
                            }
                        }
                    }
                }

                let newStringAsArray = conwas;
                // add at the end <br/> to the array item
                let newConwas = conwas.map(item => [...item, `<br/>`]).join('').split(`,`).join(``);
                await this.setState({stringAsArray: newStringAsArray, objForInnerHTML: {__html: "" + newConwas + ""}});
            } else {
                this.setState({error: `Поля Line не заполнены.`})
            }
        } else {
            this.setState({error: `Canvas не создан.`})
        }
    };

    rectangle = async (
        w = 0, h = 0,
        x1 = 0, y1 = 0, x2 = 0, y2 = 0,
        rx1 = 0, ry1 = 0, rx2 = 0, ry2 = 0
    ) => {

        if (this.state.stringAsArray.length > 1) {
            if (rx1 !== `` && ry1 !== `` && rx2 !== `` && ry2 !== ``) {

                let newW = w + 2;
                let newH = h + 2;

                let conwas = this.state.stringAsArray;

                // paint canvas
                for (let x = 0; x < newH; x++) {
                    // check top/bottom
                    if (x !== 0 || x !== newH - 1) {
                        for (let y = 0; y < newW; y++) {
                            // check first/last string
                            if (y !== 0 || y !== newW - 1) {
                                // rectangle draws
                                if ((y >= rx1 && y <= rx2 && x === ry1 || x === ry2 && y >= rx1 && y <= rx2)) {
                                    conwas[x][y] = `x`;
                                } else if (y === rx1 && x >= ry1 && x <= ry2 || y === rx2 && x >= ry1 && x <= ry2) {
                                    conwas[x][y] = `x`;
                                }
                            }
                        }
                    }
                }
                let newStringAsArray = conwas;
                // add at the end <br/> to the array item
                let newConwas = conwas.map(item => [...item, `<br/>`]).join('').split(`,`).join(``);
                await this.setState({stringAsArray: newStringAsArray, objForInnerHTML: {__html: "" + newConwas + ""}});
            } else {
                this.setState({error: `Поля Rectangle не заполнены.`})
            }
        } else {
            this.setState({error: `Canvas не создан.`})
        }
    };


    bucketFill = async (
        w = 0, h = 0,
        x1 = 0, y1 = 0, x2 = 0, y2 = 0,
        rx1 = 0, ry1 = 0, rx2 = 0, ry2 = 0,
        bx, by, newColor
    ) => {

        if (this.state.stringAsArray.length > 1) {
            if (bx !== `` && by !== `` && newColor !== ``) {

                let newW = w + 2;
                let newH = h + 2;

                let conwas = this.state.stringAsArray;

                // getting color for recursion if firstTimePainted === true
                let pointColor = ``;
                if (this.state.firstTimePainted && conwas[by][bx] !== `x`) {
                    let firstStep = conwas[by][bx].split(`:`);
                    let secondState = firstStep[1].split(`>`).join(``).split(`;`);
                    pointColor = secondState[0];
                }

                let pointToRenderArray = [];
                let pointArray = [];

                // paint canvas
                for (let x = 0; x < newH; x++) {
                    // check top/bottom
                    if (x !== 0 || x !== newH - 1) {
                        for (let y = 0; y < newW; y++) {
                            // проверяет вначале/конце: "|"
                            if (y !== 0 || y !== newW - 1) {


                                let floodFill4 = async (bx, by, newColor) => {
                                    //draw if not the first time painted
                                    if (this.state.firstTimePainted) {
                                        if (!pointArray.some(item => item === `[${by}, ${bx}]`)) {
                                            if (
                                                by > 0 && by < newH - 1 && bx > 0 && bx < newW - 1
                                                && conwas[by][bx] === `<span style='background-color:` + pointColor + `;color:` + pointColor + `'>x</span>`
                                                && conwas[by][bx] !== newColor && pointColor !== this.state.color) {

                                                pointToRenderArray.push([by, bx]);
                                                pointArray.push(`[${by}, ${bx}]`);

                                                if (conwas[by][bx] !== 'x') {
                                                    floodFill4(bx + 1, by, newColor);
                                                    floodFill4(bx - 1, by, newColor);
                                                    floodFill4(bx, by + 1, newColor);
                                                    floodFill4(bx, by - 1, newColor)
                                                    return
                                                }
                                                return
                                            }
                                            return
                                        }
                                        return
                                    }
                                    // draw if the first time painted
                                    else {
                                        if (!pointArray.some(item => item === `[${by}, ${bx}]`)) {
                                            if (by > 0 && by < newH - 1 && bx > 0 && bx < newW - 1 && conwas[by][bx] !== newColor && conwas[by][bx] === '&#8194;') {

                                                pointToRenderArray.push([by, bx]);
                                                pointArray.push(`[${by}, ${bx}]`);

                                                floodFill4(bx + 1, by, newColor);
                                                floodFill4(bx - 1, by, newColor);
                                                floodFill4(bx, by + 1, newColor);
                                                floodFill4(bx, by - 1, newColor);
                                                return
                                            }
                                            return
                                        }
                                        return
                                    }
                                };

                                floodFill4(bx, by, newColor);


                            }
                        }
                    }
                }

                // render color
                if (!this.state.firstTimePainted) {
                    for (let i = 0; i < pointToRenderArray.length; i++) {
                        let iArray = pointToRenderArray[i];
                        conwas[iArray[0]][iArray[1]] = `<span style='background-color:${newColor};color:${newColor}'>x</span>`;
                    }
                } else {
                    for (let i = 0; i < pointToRenderArray.length; i++) {
                        let iArray = pointToRenderArray[i];
                        conwas[iArray[0]][iArray[1]] = `<span style='background-color:${newColor};color:${newColor}'>x</span>`;
                    }
                }


                let newStringAsArray = conwas;
                // add at the end <br/> to the array item
                let newConwas = conwas.map(item => [...item, `<br/>`]).join('').split(`,`).join(``);
                await this.setState({
                    stringAsArray: newStringAsArray,
                    objForInnerHTML: {__html: "" + newConwas + ""},
                    firstTimePainted: true
                });

            } else {
                this.setState({error: `Поля Bucket Fill не заполнены.`})
            }
        } else {
            this.setState({error: `Canvas не создан.`})
        }
    };


    Draw = () => this.createCanvas(this.state.w, this.state.h);

    Line = () => this.drawOfLine(this.state.w, this.state.h,
        this.state.x1, this.state.y1, this.state.x2, this.state.y2);

    Rectangle = () => this.rectangle(this.state.w, this.state.h,
        this.state.x1, this.state.y1, this.state.x2, this.state.y2,
        this.state.rx1, this.state.ry1, this.state.rx2, this.state.ry2);

    BucketFill = () => this.bucketFill(this.state.w, this.state.h,
        this.state.x1, this.state.y1, this.state.x2, this.state.y2,
        this.state.rx1, this.state.ry1, this.state.rx2, this.state.ry2,
        this.state.bx, this.state.by, this.state.color);


    Clear = () => {
        this.setState({
            stringAsArray: [],
            objForInnerHTML: {__html: ""},
            w: ``, h: ``,
            x1: ``, y1: ``, x2: ``, y2: ``,
            rx1: ``, ry1: ``, rx2: ``, ry2: ``,
            bx: ``, by: ``, color: ``,
            error: ``,
            firstTimePainted: false,
        })
    };


    checkCanvas = (text, coordinateName) => {
        if (((typeof +text) === `number` && +text > 0) || +text === ``)
            this.setState({[coordinateName]: +text, error: ``});
        else
            this.setState({[coordinateName]: ``, error: `Ошибка. Введены некоректные координаты.`})
    };
    checkInputW = (text, coordinateName) => {
        if (((typeof +text) === `number` && +text > 0 && +text <= this.state.w) || +text === ``)
            this.setState({[coordinateName]: +text, error: ``});
        else
            this.setState({[coordinateName]: ``, error: `Ошибка. Введены некоректные координаты.`})
    };
    checkInputH = (text, coordinateName) => {
        if (((typeof +text) === `number` && +text > 0 && +text <= this.state.h) || +text === ``)
            this.setState({[coordinateName]: +text, error: ``});
        else
            this.setState({[coordinateName]: ``, error: `Ошибка. Введены некоректные координаты.`})
    };


    wCanvas = (e) => this.checkCanvas(e.currentTarget.value, `w`);
    hCanvas = (e) => this.checkCanvas(e.currentTarget.value, `h`);

    x1Line = (e) => this.checkInputW(e.currentTarget.value, `x1`);
    y1Line = (e) => this.checkInputH(e.currentTarget.value, `y1`);
    x2Line = (e) => this.checkInputW(e.currentTarget.value, `x2`);
    y2Line = (e) => this.checkInputH(e.currentTarget.value, `y2`);

    x1Rectangle = (e) => this.checkInputW(e.currentTarget.value, `rx1`);
    y1Rectangle = (e) => this.checkInputH(e.currentTarget.value, `ry1`);
    x2Rectangle = (e) => this.checkInputW(e.currentTarget.value, `rx2`);
    y2Rectangle = (e) => this.checkInputH(e.currentTarget.value, `ry2`);

    xBucketFill = (e) => this.checkInputW(e.currentTarget.value, `bx`);
    yBucketFill = (e) => this.checkInputH(e.currentTarget.value, `by`);


    render() {
        return (
            <div className={css.DrawWindow}>
                <div className={css.buttonWithSketchPicker}>
                    <SketchPicker color={this.state.color} onChange={(e) => this.setState({color: e.hex})}/>
                    <div>
                        <button onClick={() => this.Clear()} className={css.button}>Clear</button>
                        <div>
                            <button onClick={() => this.Draw()} className={css.button}>Create Canvas</button>
                            <input type="text" placeholder={`w:`} className={css.input} onChange={(e) => this.wCanvas(e)} value={this.state.w}/>
                            <input type="text" placeholder={`h:`} className={css.input} onChange={(e) => this.hCanvas(e)} value={this.state.h}/>
                        </div>
                        <div>
                            <button onClick={() => this.Line()} className={css.button}>Line</button>
                            <input type="text" placeholder={`Line: x1`} className={css.input} onChange={(e) => this.x1Line(e)} value={this.state.x1}/>
                            <input type="text" placeholder={`Line: y1`} className={css.input} onChange={(e) => this.y1Line(e)} value={this.state.y1}/>
                            <input type="text" placeholder={`Line: x2`} className={css.input} onChange={(e) => this.x2Line(e)} value={this.state.x2}/>
                            <input type="text" placeholder={`Line: y2`} className={css.input} onChange={(e) => this.y2Line(e)} value={this.state.y2}/>
                        </div>
                        <div>
                            <button onClick={() => this.Rectangle()} className={css.button}>Rectangle</button>
                            <input type="text" placeholder={`Rectangle: x1`} className={css.input} onChange={(e) => this.x1Rectangle(e)} value={this.state.rx1}/>
                            <input type="text" placeholder={`Rectangle: y1`} className={css.input} onChange={(e) => this.y1Rectangle(e)} value={this.state.ry1}/>
                            <input type="text" placeholder={`Rectangle: x2`} className={css.input} onChange={(e) => this.x2Rectangle(e)} value={this.state.rx2}/>
                            <input type="text" placeholder={`Rectangle: y2`} className={css.input} onChange={(e) => this.y2Rectangle(e)} value={this.state.ry2}/>
                        </div>
                        <div>
                            <button onClick={() => this.BucketFill()} className={css.button}>Bucket Fill</button>
                            <input type="text" placeholder={`BucketFill: x`} className={css.input} onChange={(e) => this.xBucketFill(e)} value={this.state.bx}/>
                            <input type="text" placeholder={`BucketFill: y`} className={css.input} onChange={(e) => this.yBucketFill(e)} value={this.state.by}/>
                            <input type="text" placeholder={`Выберите:`} className={css.input} value={this.state.color}/>
                        </div>
                        <div>{this.state.error}</div>
                    </div>
                </div>
                <br/><br/>
                <span dangerouslySetInnerHTML={this.state.objForInnerHTML}/>
            </div>
        )
    }
}