// Javascript shape
function NodeJSShape()
{
    mxRectangleShape.call(this);
};
mxUtils.extend(NodeJSShape, mxRectangleShape);
NodeJSShape.prototype.isHtmlAllowed = function()
{
    return false;
};
NodeJSShape.prototype.getLabelBounds = function(rect)
{
    if (this.style['double'] == 1)
    {
        var margin = (Math.max(2, this.strokewidth + 1) + parseFloat(this.style[mxConstants.STYLE_MARGIN] || 0)) * this.scale;

        return new mxRectangle(rect.x + margin, rect.y + margin, rect.width - 2 * margin, rect.height - 2 * margin);
    }

    return rect;
};

NodeJSShape.prototype.paintForeground = function(c, x, y, w, h)
{
    if (this.style != null)
    {
        if (!this.outline && this.style['double'] == 1)
        {
            var margin = Math.max(2, this.strokewidth + 1) + parseFloat(this.style[mxConstants.STYLE_MARGIN] || 0);
            x += margin;
            y += margin;
            w -= 2 * margin;
            h -= 2 * margin;

            if (w > 0 && h > 0)
            {
                mxRectangleShape.prototype.paintBackground.apply(this, arguments);
            }
        }

        c.setDashed(false);

        // Draws the symbols defined in the style. The symbols are
        // numbered from 1...n. Possible postfixes are align,
        // verticalAlign, spacing, arcSpacing, width, height
        var counter = 0;
        var shape = null;

        do
        {
            shape = mxCellRenderer.prototype.defaultShapes[this.style['symbol' + counter]];

            if (shape != null)
            {
                var align = this.style['symbol' + counter + 'Align'];
                var valign = this.style['symbol' + counter + 'VerticalAlign'];
                var width = this.style['symbol' + counter + 'Width'];
                var height = this.style['symbol' + counter + 'Height'];
                var spacing = this.style['symbol' + counter + 'Spacing'] || 0;
                var arcspacing = this.style['symbol' + counter + 'ArcSpacing'];

                if (arcspacing != null)
                {
                    spacing += this.getArcSize(w + this.strokewidth, h + this.strokewidth) * arcspacing;
                }

                var x2 = x;
                var y2 = y;

                if (align == mxConstants.ALIGN_CENTER)
                {
                    x2 += (w - width) / 2;
                }
                else if (align == mxConstants.ALIGN_RIGHT)
                {
                    x2 += w - width - spacing;
                }
                else
                {
                    x2 += spacing;
                }

                if (valign == mxConstants.ALIGN_MIDDLE)
                {
                    y2 += (h - height) / 2;
                }
                else if (valign == mxConstants.ALIGN_BOTTOM)
                {
                    y2 += h - height - spacing;
                }
                else
                {
                    y2 += spacing;
                }

                c.save();

                // Small hack to pass style along into subshape
                var tmp = new shape();
                // TODO: Clone style and override settings (eg. strokewidth)
                tmp.style = this.style;
                shape.prototype.paintVertexShape.call(tmp, c, x2, y2, width, height);
                c.restore();
            }

            counter++;
        }
        while (shape != null);
    }

    // Paints glass effect
    mxRectangleShape.prototype.paintForeground.apply(this, arguments);
};

mxCellRenderer.prototype.defaultShapes['nodejs'] = NodeJSShape;