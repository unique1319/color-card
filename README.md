# color-card
> 基于canvas绘制的色卡快速构建插件.

Color-card is a fast building plug-in for color cards based on canvas drawing.
It is very small and convenient, without any dependence.

There are three color-card drawing types in total: ``standard``  ``mapping`` ``gradients``

You can use it in most cases, and You can specify whether the color-card is oriented horizontally or vertically
## Installation

```sh
<script src="color-card.js"></script>
```

## Usage example

Color-card provides a default color card library.
You can use the default color scheme.

The default color schemes currently supported are:

``pre1h (降水1h)``
``pre3h (降水3h)``
``pre6h (降水6h)``
``pre12h (降水12h)``
``pre24h (降水24h)``
``tem (温度)``
``wind (风)``
``weather (天气现象)``
``pph (降水相态)``
``vis (能见度)``
``soil (土壤)``
``rhu (相对湿度)``
``clt (云类型)``
``clp (云相态)``
``clm (云检测)``
``red13 (红外亮温)``
``ssi (太阳辐射)``


html:
```sh
<canvas id="canvas1"></canvas>
<canvas id="canvas2"></canvas>
```
script:
```sh
let colorCard1 = new ColorCard({
     id: 'canvas1',
     valColor: 'white',
     drawType: 'mapping',
     ...
});
colorCard1.setColorLibraryWithDes(ColorLibrary.pph.colorCard).draw();
```

Of course, you can also customize the color scheme:

```sh
let colorCard2 = new ColorCard({
    id: 'canvas2',
    valColor: 'white',
    values: ['-Infinity', '0.1', '10', '25', '50', '100', '250', '500'],
    colors: ['#fff', '#a5f38d', '#3db93f', '#63b8f9', '#0000fe', '#f305ee', '#810040'],
    drawType: 'standard',
    ...
});
colorCard2.draw();
```
For positive and negative infinity, pass ``'-Infinity'`` or ``'infinity'`` in values array.

#### [Usage Example](https://unique1319.github.io/color-card/) ####

## Release History

* 0.9
    * CREATE: add color-card repository


## Meta

wrh – [@unique1319](https://github.com/unique1319) – wrh1319@163.com

Distributed under the ``Apache License 2.0`` license. See ``LICENSE`` for more information.
<https://github.com/unique1319/color-card/blob/master/LICENSE>

## Contributing

1. Fork it (<https://github.com/unique1319/color-card/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
