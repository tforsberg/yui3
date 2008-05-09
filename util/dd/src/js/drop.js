YUI.add('dd-drop', function(Y) {
    var Event = Y.Event;
    /**
     * Basic template for utilities that consume Nodes 
     * @class Sample
     */
    var Drop = function() {
        Drop.superclass.constructor.apply(this, arguments);

        this.createShim();
        Y.DD.DDM.regTarget(this);
        /* TODO
        if (Dom.getStyle(this.el, 'position') == 'fixed') {
            Event.on(window, 'scroll', function() {
                this.activateShim();
            }, this, true);
        }
        */
    };

    Drop.NAME = 'Drop';

    Drop.ATTRS = {
        node: {
            set: function(node) {
                return Y.Node.get(node);
            }
        }

    };

    var proto = {
        shim: null,
        region: null,
        activateShim: function(xy, hw) {
            var oh = this.get('node').get('offsetHeight');
            var nh = oh;
            if (Y.DD.DDM.intersect) {
                nh = oh + ((hw[0] - y) * 2);
            }
            var ow = this.get('node').get('offsetWidth');
            var nw = ow;
            /*TODO
            if (Y.DD.DDM.intersect) {
                nw = ow + ((hw[1] - x) * 2);
            }
            */
            this.shim.setStyle('height', nh + 'px').setStyle('width', nw + 'px');
            var _xy = this.get('node').getXY();
            /*TODO
            if (Y.DD.DDM.intersect) {
                xy = [(xy[0] - (w - x)), (xy[1] - (h - y))];
            }
            */

            this.shim.setXY(_xy); //Replaced later with relative calls

            this.region = {
                t: _xy[1],
                l: _xy[0],
                h: nh,
                w: nw
            };
            //Report position to DDM
            Y.DD.DDM.syncTarget(this, _xy);
        },
        move: function() {
            //this.get('node').set('innerHTML', '<br>Over Target');
            this.fire('drop:over');
        },
        overTarget: null,
        createShim: function() {
            var s = Y.Node.create(['div', { id: this.get('node').get('id') + '_shim' }]);
            s.setStyles({
                height: this.get('node').get('offsetHeight') + 'px',
                width: this.get('node').get('offsetWidth') + 'px',
                backgroundColor: 'yellow',
                opacity: '.5',
                zIndex: 10,
                position:  'absolute'
            });
            Y.DD.DDM.pg.appendChild(s);
            this.shim = s;

            s.on('mouseover', this._handleOver, this, true);
            s.on('mouseout', this._handleOut, this, true);
        },
        _handleOver: function() {
            //this.get('node').set('innerHTML', 'Enter Target');
            if (!this.overTarget) {
                this.overTarget = true;
                this.fire('drop:enter');
            }
        },
        _handleOut: function() {
            //this.get('node').set('innerHTML', 'Exit Target');
            this.overTarget = false;
            if (Y.DD.DDM.activeDrag) {
                this.fire('drop:exit');
            } else {
                this.fire('drop:drop');
            }
        }
        
    };

    Y.extend(Drop, Y.Base, proto);
    Y.DD.Drop = Drop;

}, '3.0.0', { requires: ['dd-drag'] });
