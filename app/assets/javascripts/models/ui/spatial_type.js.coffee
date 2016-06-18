ns = @edsc.models.ui

ns.SpatialType = do (ko, $=jQuery) ->

  # Keeps track of the user's interface selections for the purpose of keeping buttons in sync
  class SpatialType
    constructor: (@query) ->
      @icon = ko.observable('fa-crop')
      @name = ko.observable('Spatial')
      @displaySpatial = ko.computed(read: @_getDisplaySpatialName, owner: this, deferEvaluation: true)
      @mapControlTop = ko.computed(read: @_setMapControlPosition, owner: this)
      @manualEntryVisible = ko.observable(false)

    selectNone: =>
      @name('Spatial')
      @icon('fa-crop')
      @manualEntryVisible(false)

    selectPoint: =>
      @name('Point')
      @icon('fa-map-marker')
      @manualEntryVisible(true)

    selectRectangle: =>
      @name('Rectangle')
      @icon('edsc-icon-rect-open')
      @manualEntryVisible(true)

    selectPolygon: =>
      @name('Polygon')
      @icon('edsc-icon-poly-open')
      @manualEntryVisible(false)

    selectShapefile: =>
      @name('Shape File')
      @icon('fa-file-o')
      @manualEntryVisible(false)

    _toReadableName: (name)->
      return 'Point' if name == 'point'
      return 'Rectangle' if name == 'bounding_box'
      null

    _getDisplaySpatialName: ->
      spatialParam = @_toReadableName(@query.spatial()?.split(':')[0])
      if @name() == 'Spatial'
        if spatialParam?.length > 0 then return spatialParam else return null
      if spatialParam != @name() then return @name() else return @name()

    _setMapControlPosition: ->
      value = @displaySpatial()
      top = '85px'
      if value == 'Point'
        top = '160px'
      else if value == 'Rectangle'
        top = '230px'
      document.getElementsByClassName('leaflet-top leaflet-right')?[0]?.style.top = top

  exports = SpatialType
