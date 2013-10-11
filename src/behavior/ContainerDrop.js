(function () {
    /**
     * @class PMUI.behavior.ContainerDropBehavior
     * Encapsulates the drop behavior of a container
     * @extends PMUI.behavior.DropBehavior
     *
     * @constructor
     * Creates a new instance of the class
     * @param {Array} [selectors=[]] css selectors that this drop behavior will
     * accept
     */
    var ContainerDropBehavior = function (selectors) {
        ContainerDropBehavior.superclass.call(this, selectors);
    };

    PMUI.inheritFrom('PMUI.behavior.DropBehavior', ContainerDropBehavior);
    /**
     * Type of the instances
     * @property {String}
     */
    ContainerDropBehavior.prototype.type = "ContainerDropBehavior";
    /**
     * Default selectors for this drop behavior
     * @property {String}
     */
    ContainerDropBehavior.prototype.defaultSelector = ".custom_shape";

    /**
     * On drop handler for this drop behavior, creates shapes when dropped from the
     * toolbar, or move shapes among containers
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    ContainerDropBehavior.prototype.onDrop = function (shape) {
        return function (e, ui) {
            var customShape = null,
                canvas = shape.getCanvas(),
                selection,
                sibling,
                i,
                command,
                coordinates,
                id,
                shapesAdded = [],
                containerBehavior = shape.containerBehavior;
            if (canvas.readOnly) {
                return false;
            }

            shape.entered = false;
            if (ui.helper && ui.helper.attr('id') === "drag-helper") {
                return false;
            }
            id = ui.draggable.attr('id');
            customShape = canvas.shapeFactory(id);
            if (customShape === null) {

                customShape = canvas.customShapes.find('id', id);

                if (!customShape || !shape.dropBehavior.dropHook(shape, e, ui)) {
                    return false;
                }

                if (!(customShape.parent &&
                    customShape.parent.id === shape.id)) {

                    selection = canvas.currentSelection;
                    for (i = 0; i < selection.getSize(); i += 1) {
                        sibling = selection.get(i);
                        coordinates = PMUI.getPointRelativeToPage(sibling);
                        coordinates = PMUI.pageCoordinatesToShapeCoordinates(shape, null,
                                coordinates.x, coordinates.y);
                        shapesAdded.push({
                            shape: sibling,
                            container: shape,
                            x: coordinates.x,
                            y: coordinates.y,
                            topLeft: false
                        });
                    }
                    command = new PMUI.command.CommandSwitchContainer(shapesAdded);
                    command.execute();
                    canvas.commandStack.add(command);
                    canvas.multipleDrop = true;

                }

                // fix resize minWidth and minHeight and also fix the dimension
                // of this shape (if a child made it grow)
                shape.updateDimensions(10);
                canvas.updatedElement = null;

            } else {
                coordinates = PMUI.pageCoordinatesToShapeCoordinates(shape, e);
                shape.addElement(customShape, coordinates.x, coordinates.y,
                        customShape.topLeftOnCreation);

                //since it is a new element in the designer, we triggered the
                //custom on create element event
                canvas.updatedElement = customShape;

                // create the command for this new shape
                command = new PMUI.command.CommandCreate(customShape);
                canvas.commandStack.add(command);
                command.execute();
                //shape.updateSize();
            }
        };
    };

    PMUI.extendNamespace('PMUI.behavior.ContainerDropBehavior', ContainerDropBehavior);
}());
