/**
 * @author  wrh
 * @date  2020/9/15 14:36
 * @version 1.0
 */

;(function (undefined) {
    "use strict"
    let _global;

    if (!('getElementsByClass' in HTMLElement)) {
        HTMLElement.prototype.getElementsByClass = function (n) {
            let el = [],
                _el = this.getElementsByTagName('*');
            for (let i = 0; i < _el.length; i++) {
                if (!!_el[i].className && (typeof _el[i].className == 'string') && _el[i].className.indexOf(n) > -1) {
                    el[el.length] = _el[i];
                }
            }
            return el;
        };
        ((typeof HTMLDocument !== 'undefined') ? HTMLDocument : Document).prototype.getElementsByClass = HTMLElement.prototype.getElementsByClass;
    }

    function extend(o, n, override) {
        for (let key in n) {
            if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                o[key] = n[key];
            }
        }
        return o;
    }

    function ColorCard(opt) {
        this._initial(opt);
    }

    /**
     * init options:{
     *     id: Canvas Dom Id;
     *     width:
     *     height: Canvas 总宽
     *     values[]: 色卡值一维数组,
     *     colors[]: 色标一维数组,
     *     valFont:
     *     valFontSize:
     *     valColor:
     *     valAreaThickness:
     *     drawType: 色卡绘制类型:
     *             'standard':标准模式，色标对应色卡值一个区间范围，传入色卡值数组比色标数组长度始终多一，对于正无穷和负无穷必须传入Infinity和-Infinity；
     *             'mapping':填色模式，色卡值与色标一一对应，颜色对应具体数值；
     *             'gradients':渐变模式；
     * }
     */
    ColorCard.prototype = {
        constructor: this,
        _initial: function (opt) {
            let options = {
                id: null,
                width: 600, //Canvas 总长
                height: 45, //Canvas 总宽
                values: [], //色卡值一维数组
                colors: [], //色标一维数组
                drawType: 'mapping',    //色卡绘制类型，可选择标准模式（standard）或填色模式（mapping）或渐变模式（gradients）
                direction: 'horizontal',    //色卡方向，可选水平方向（horizontal）或垂直方向（vertical）
                valFont: 'Arial',   //色卡值字体
                valFontSize: '16',  //色卡值字号
                valColor: 'black',  //色卡值字色
                valAreaThickness: 26,   //色卡值区域厚度
                valAreaPadding: 15  //色卡值显示区域内边距，设置合适数值可防止某些情况下头尾色卡值显示不全
            };
            this.options = extend(options, opt, true);
            this._canvas = document.getElementById(this.options.id);
            !this._canvas.getContext && alert('canvas无法加载 id:' + this.options.id);
            this._canvas.width = this.options.width;
            this._canvas.height = this.options.height;
            this._ctx = this._canvas.getContext('2d');
        },

        setColorLibrary: function (opt) {
            this.options.values = opt.values;
            this.options.colors = opt.colors;
            return this;
        },

        setColorLibraryWithDes: function (opt) {
            this.options.values = opt.des;
            this.options.colors = opt.colors;
            return this;
        },

        draw: function () {
            this._baseInit();
            switch (this.options.drawType) {
                case 'standard':
                    this.drawOnStandard();
                    break;
                case 'mapping':
                    this.drawOnMapping();
                    break;
                case 'gradients':
                    this.drawOnGradients();
                    break;
            }
        },
        drawOnStandard: function () {
            this.options.direction === 'horizontal' ? this._drawOnStandardOnHorizontal() : (this.options.direction === 'vertical' ? this._drawOnStandardOnVertical() : alert('options参数错误，direction类型必须为horizontal或vertical'));
        },
        drawOnMapping: function () {
            this.options.direction === 'horizontal' ? this._drawOnMappingOnHorizontal() : (this.options.direction === 'vertical' ? this._drawOnMappingOnVertical() : alert('options参数错误，direction类型必须为horizontal或vertical'));
        },
        drawOnGradients: function () {
            this.options.direction === 'horizontal' ? this._drawOnGradientsOnHorizontal() : (this.options.direction === 'vertical' ? this._drawOnGradientsOnVertical() : alert('options参数错误，direction类型必须为horizontal或vertical'));
        },

        _drawOnStandardOnHorizontal: function () {
            !(this._vSzie === this._cSzie + 1) && alert('options参数错误，standard类型需要values长度等于colors长度加1，对于正无穷和负无穷必须传入Infinity和-Infinity');
            for (let i = 0; i < this._cSzie; i++) {
                const c = this.options.colors[i];
                this._ctx.fillStyle = c;
                this._ctx.fillRect(i * this._blockW + this.options.valAreaPadding, 0, this._blockW, this._blockH);
            }
            for (let i = 0; i < this._vSzie; i++) {
                const txt = this.options.values[i]
                if (txt === "Infinity" || txt === "-Infinity") continue;
                this._ctx.font = this.options.valFontSize + "px " + this.options.valFont;
                this._ctx.fillStyle = this.options.valColor;
                const _w = this._ctx.measureText(txt).width;
                this._ctx.fillText(txt, i * this._blockW - 0.5 * _w + this.options.valAreaPadding, this.options.height - (this.options.valAreaThickness - this.options.valFontSize) / 2, this._blockW);
            }
        },

        _drawOnMappingOnHorizontal: function () {
            !(this._vSzie === this._cSzie) && alert('options参数错误，mapping类型需要values和colors大小一致');
            for (let i = 0; i < this._cSzie; i++) {
                const c = this.options.colors[i];
                this._ctx.fillStyle = c;
                this._ctx.fillRect(i * this._blockW + this.options.valAreaPadding, 0, this._blockW, this._blockH);
            }
            for (let i = 0; i < this._vSzie; i++) {
                const txt = this.options.values[i]
                this._ctx.font = this.options.valFontSize + "px " + this.options.valFont;
                this._ctx.fillStyle = this.options.valColor;
                const _w = this._ctx.measureText(txt).width;
                this._ctx.fillText(txt, (i + 0.5) * this._blockW - 0.5 * _w + this.options.valAreaPadding, this.options.height - (this.options.valAreaThickness - this.options.valFontSize) / 2, this._blockW);
            }
        },

        _drawOnGradientsOnHorizontal: function () {
            !(this._vSzie === this._cSzie + 1) && alert('options参数错误，gradients，对于正无穷和负无穷必须传入Infinity和-Infinity');
            let grad = this._ctx.createLinearGradient(this.options.valAreaPadding, 0, this.options.width - 2 * this.options.valAreaPadding, 0);
            for (let i = 0; i < this._cSzie; i++) {
                const c = this.options.colors[i];
                grad.addColorStop(i / (this._cSzie - 1), c);
            }
            this._ctx.fillStyle = grad;
            this._ctx.fillRect(this.options.valAreaPadding, 0, this.options.width - 2 * this.options.valAreaPadding, this._blockH);

            for (let i = 0; i < this._vSzie; i++) {
                const txt = this.options.values[i]
                if (txt === "Infinity" || txt === "-Infinity") continue;
                this._ctx.font = this.options.valFontSize + "px " + this.options.valFont;
                this._ctx.fillStyle = this.options.valColor;
                const _w = this._ctx.measureText(txt).width;
                this._ctx.fillText(txt, i * this._blockW - 0.5 * _w + this.options.valAreaPadding, this.options.height - (this.options.valAreaThickness - this.options.valFontSize) / 2, this._blockW);
            }
        },

        _drawOnStandardOnVertical: function () {
            !(this._vSzie === this._cSzie + 1) && alert('options参数错误，standard类型需要values长度等于colors长度加1，对于正无穷和负无穷必须传入Infinity和-Infinity');
            for (let i = 0; i < this._cSzie; i++) {
                const c = this.options.colors[i];
                this._ctx.fillStyle = c;
                this._ctx.fillRect(0, i * this._blockH + this.options.valAreaPadding, this._blockW, this._blockH);
            }
            for (let i = 0; i < this._vSzie; i++) {
                const txt = this.options.values[i]
                if (txt === "Infinity" || txt === "-Infinity") continue;
                this._ctx.font = this.options.valFontSize + "px " + this.options.valFont;
                this._ctx.fillStyle = this.options.valColor;
                const _h = this._ctx.measureText(txt).actualBoundingBoxAscent;
                this._ctx.fillText(txt, this._blockW + (this.options.valAreaThickness - _h) / 2, i * this._blockH + 0.5 * this.options.valFontSize + this.options.valAreaPadding, this.options.valAreaThickness);
            }
        },

        _drawOnMappingOnVertical: function () {
            !(this._vSzie === this._cSzie) && alert('options参数错误，mapping类型需要values和colors大小一致');
            for (let i = 0; i < this._cSzie; i++) {
                const c = this.options.colors[i];
                this._ctx.fillStyle = c;
                this._ctx.fillRect(0, i * this._blockH + this.options.valAreaPadding, this._blockW, this._blockH);
            }
            for (let i = 0; i < this._vSzie; i++) {
                const txt = this.options.values[i]
                this._ctx.font = this.options.valFontSize + "px " + this.options.valFont;
                this._ctx.fillStyle = this.options.valColor;
                const _h = this._ctx.measureText(txt).actualBoundingBoxAscent;
                this._ctx.fillText(txt, this._blockW + (this.options.valAreaThickness - _h) / 2, (i + 0.5) * this._blockH + 0.5 * this.options.valFontSize + this.options.valAreaPadding, this.options.valAreaThickness);
            }
        },

        _drawOnGradientsOnVertical: function () {
            !(this._vSzie === this._cSzie + 1) && alert('options参数错误，gradients，对于正无穷和负无穷必须传入Infinity和-Infinity');
            let grad = this._ctx.createLinearGradient(0, this.options.valAreaPadding, 0, this.options.height - 2 * this.options.valAreaPadding);
            for (let i = 0; i < this._cSzie; i++) {
                const c = this.options.colors[i];
                grad.addColorStop(i / (this._cSzie - 1), c);
            }
            this._ctx.fillStyle = grad;
            this._ctx.fillRect(0, this.options.valAreaPadding, this._blockW, this.options.height - 2 * this.options.valAreaPadding);

            for (let i = 0; i < this._vSzie; i++) {
                const txt = this.options.values[i]
                if (txt === "Infinity" || txt === "-Infinity") continue;
                this._ctx.font = this.options.valFontSize + "px " + this.options.valFont;
                this._ctx.fillStyle = this.options.valColor;
                const _h = this._ctx.measureText(txt).actualBoundingBoxAscent;
                this._ctx.fillText(txt, this._blockW + (this.options.valAreaThickness - _h) / 2, i * this._blockH + 0.5 * this.options.valFontSize + this.options.valAreaPadding, this.options.valAreaThickness);
            }
        },


        _baseInit: function () {
            this._vSzie = this.options.values.length;
            this._cSzie = this.options.colors.length;
            this._blockW = null;
            this._blockH = null;
            this._calcBlockW();
            this._calcBlockH();
        },

        _calcBlockW: function () {
            if (this.options.direction === 'horizontal') {
                this._blockW = (this.options.width - 2 * this.options.valAreaPadding) / this._cSzie;
            } else {
                this._blockW = this.options.width - this.options.valAreaThickness;
            }
        },

        _calcBlockH: function () {
            if (this.options.direction === 'horizontal') {
                this._blockH = this.options.height - this.options.valAreaThickness;
            } else {
                this._blockH = (this.options.height - 2 * this.options.valAreaPadding) / this._cSzie;
            }

        },
    }

    _global = (function () {
        return this || (0, eval)('this');
    }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = ColorCard;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return ColorCard;
        });
    } else {
        !('ColorCard' in _global) && (_global.ColorCard = ColorCard);
    }

}());

const ColorLibrary = {
    pre1h: {
        title: '降水(1h)',
        unit: 'mm',
        colorCard: {
            values: ['0.1', '1.6', '7', '15', '40', '50', 'Infinity'],
            colors: ['#a5f38d', '#3db93f', '#63b8f9', '#0000fe', '#f305ee', '#810040']
        }
    },
    pre3h: {
        title: '降水(3h)',
        unit: 'mm',
        colorCard: {
            values: ['0.1', '3', '10', '20', '50', '70', 'Infinity'],
            colors: ['#a5f38d', '#3db93f', '#63b8f9', '#0000fe', '#f305ee', '#810040']
        }
    },
    pre6h: {
        title: '降水(6h)',
        unit: 'mm',
        colorCard: {
            values: ['0.1', '4', '13', '25', '60', '120', 'Infinity'],
            colors: ['#a5f38d', '#3db93f', '#63b8f9', '#0000fe', '#f305ee', '#810040']
        }
    },
    pre12h: {
        title: '降水(12h)',
        unit: 'mm',
        colorCard: {
            values: ['0.1', '5', '15', '30', '70', '140', 'Infinity'],
            colors: ['#a5f38d', '#3db93f', '#63b8f9', '#0000fe', '#f305ee', '#810040']
        }
    },
    pre24h: {
        title: '降水(24h)',
        unit: 'mm',
        colorCard: {
            values: ['0.1', '10', '25', '50', '100', '250', 'Infinity'],
            colors: ['#a5f38d', '#3db93f', '#63b8f9', '#0000fe', '#f305ee', '#810040']
        }
    },

    tem: {
        title: '温度',
        unit: '℃',
        colorCard: {
            values: ['-Infinity', '-12', '-8', '-6', '-4', '-2', '0', '2', '4', '6', '8', '12', '16', '20', '24', '26', '28', '30', '32', '35', '37', '38', 'Infinity'],
            colors: ['#0808f7', '#0845ef', '#0865ef', '#0882f7', '#08a2f7', '#08beef', '#08dbef', '#18ffff', '#18ffbd', '#18ff84', '#18ff42', '#84ff18', '#9cff18', '#bdff18', '#deff18', '#ffe718', '#ffcb18', '#ffaa18', '#ff8e18', '#ff7118', '#ff5118', '#ff3c18']
        }
    },

    wind: {
        title: '风',
        unit: 'm/s',
        colorCard: {
            values: ['1.6', '3.4', '5.5', '8', '10.8', '13.9', '17.2', '20.8', '24.5', '28.5', 'Infinity'],
            colors: ['#59fe04', '#d5fd00', '#fffe00', '#ffcf00', '#ff8d00', '#ff4e00', '#ff0000', '#c14d00', '#7a0400', '#5b1c00']
        }
    },

    weather: {
        title: '天气现象',
        unit: '',
        colorCard: {
            des: ['晴(0)', '多云(1)', '阴(2)', '雷阵雨(4)', '雷阵雨并伴有冰雹(5)', '雨夹雪(6)', '小雨(7)', '中雨(8)', '大雨(9)', '暴雨(10)', '大暴雨(11)', '特大暴雨(12)', '小雪(14)', '中雪(15)', '大雪(16)', '暴雪(17)', '雾(18)', '冻雨(19)', '沙尘暴(20)', '扬沙或浮尘(30)', '强沙尘暴(31)', '霾(53)'],
            values: ['0', '1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '15', '16', '17', '18', '19', '20', '30', '31', '53'],
            colors: ['#eeeeee', '#eeeeee', '#eeeeee', '#ffddbb', '#88aaff', '#ffbbee', '#aaff88', '#33bb33', '#66bbff', '#0000ff', '#ff00ff', '#880044', '#cccccc', '#aaaaaa', '#777777', '#444444', '#aa7711', '#ff8800', '#eeeeee', '#eeeeee', '#a19987', '#aa9988']
        }
    },

    pph: {
        title: '降水相态',
        unit: '',
        colorCard: {
            des: ['无降水(-1)', '雨(1)', '混合(2)', '雪(3)', '冻雨(4)'],
            values: ['-1', '1', '2', '3', '4'],
            colors: ['#eeeeee', '#a6f28f', '#ffbeef', '#cecece', '#ff8000']
        }
    },

    vis: {
        title: '能见度',
        unit: 'km',
        colorCard: {
            values: ['-Infinity', '0.1', '0.2', '0.5', '1', '2', '3', '5', '10', '15', '20', '30', 'Infinity'],
            colors: ['#722c00', '#9f00ff', '#ff0203', '#ff5600', '#ffd300', '#efeb35', '#bdfb30', '#78fd37', '#34fbb1', '#6acbe7', '#9de9f7', '#d4eeec']
        }
    },

    soil: {
        title: '土壤',
        unit: '%',
        colorCard: {
            values: ['-Infinity', '40', '60', '90', 'Infinity'],
            colors: ['#b51c22', '#fffb42', '#68ef12', '#00c5d7']
        }
    },

    rhu: {
        title: '相对湿度',
        unit: '%',
        colorCard: {
            values: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
            colors: ['#97e8ad', '#99d2ca', '#9bbce8', '#6b9de2', '#3a7edb', '#2c5cc2', '#1d3ba9', '#102c90', '#071f77', '#010e50']
        }
    },

    clt: {
        title: '云类型',
        unit: '',
        colorCard: {
            des: ['0(晴空)', '2(暖水云)', '3(过冷水云)', '4(混合云)', '5(厚冰云)', '6(卷云)', '7(多层云)'],
            values: ['0', '2', '3', '4', '5', '6', '7'],
            colors: ['#ffffff', '#0000f4', '#20a5e0', '#22feab', '#fe0000', '#b514ff', '#6ffb02']
        }
    },

    clp: {
        title: '云相态',
        unit: '',
        colorCard: {
            des: [],
            values: ['2', '3', '4', '5', '9'],
            colors: ['#0000f4', '#20a5e0', '#21ffac', '#fe0000', '#e1b401']
        }
    },

    clm: {
        title: '云检测',
        unit: '',
        colorCard: {
            des: ['0(云)', '1(可能云)', '2(可能晴空)', '3(晴空)'],
            values: ['0', '1', '2', '3'],
            colors: ['#ffffff', '#a6a1a7', '#02e827', '#0d8000']
        }
    },

    red13: {
        title: '红外亮温',
        unit: '',
        colorCard: {
            values: ['-Infinity', '105', '139', '150', '167', '202', '221', '231', '243', '252', '260', '267', '274', '282', '288', '294', '310', '315'],
            colors: ['#0a0a0a', '#222222', '#2d2e2d', '#535053', '#eba6c3', '#f53637', '#ba9551', '#d1d39c', '#a2d4ea', '#8fbad9', '#7ca0c8', '#6582b5', '#4d62a0', '#3a468d', '#2b357f', '#0e0e5f', '#0a0a5b']
        }
    },

    ssi: {
        title: '太阳辐射',
        unit: '',
        colorCard: {
            values: ['-Infinity', '100', '140', '180', '220', '260', '300', '340', '380', '420', '460', '500', '540', '580', '620', '660', '700', '740', '780', '820', '860', '900', '940', '980', '1020', '1060', 'Infinity'],
            colors: ['#330d80', '#462192', '#5440b6', '#4349c9', '#4d66d2', '#5775d5', '#4f97e1', '#84b9fb', '#6cc6ec', '#73e1e7', '#abf7eb', '#cbfbda', '#eefdca', '#f9fad5', '#fcf2ac', '#fde37d', '#fcc865', '#faa644', '#fa9200', '#ff791a', '#f05d04', '#f74f14', '#fc2603', '#e70000', '#d50637', '#bb012d']
        }
    },

};