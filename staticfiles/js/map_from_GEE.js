const opacity_asset = $('#opacity_asset');
opacity_asset.hide();
const opacity_collection = $('#opacity_collection');
opacity_collection.hide();
const collection_opacity = $('#collection_opacity');
const asset_opacity = $('#asset_opacity');

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

[...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
const map = L.map('map2', {center: [42.35, -71.08], zoom: 3});

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// create a satellite imagery layer
let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
const baseMaps = {

    "OpenStreetMap": osm,
    "Satellite": satellite
};
let gee_layer, user_layer;
const datamaps = {
    "ImageCollection": gee_layer,
    "UserAsset": user_layer
};
ajax_call("get-gee-user-layer", {}).done(function (data) {
    console.log(data.url);
    user_layer = L.tileLayer(data.url, {
        zoom: 3,
        zIndex: 400,
        opacity: 0.5
    });
});
ajax_call("get-gee-layer", {}).done(function (data) {
    gee_layer = L.tileLayer(data.url, {
        zoom: 3,
        zIndex: 400,
        opacity: 0.5
    });
});

$("#collection").change(function () {
    if (this.checked) {
        gee_layer.addTo(map);
        opacity_collection.show();
        collection_opacity.text(Math.round(opacity_collection.val() * 100) + "%");
        collection_opacity.show();
    } else {
        gee_layer.remove();
        collection_opacity.hide();
        opacity_collection.hide();
    }
});

$("#asset").change(function () {
    if (this.checked) {
        user_layer.addTo(map);
        opacity_asset.show();
        asset_opacity.text(Math.round(opacity_asset.val() * 100) + "%");
        asset_opacity.show();

    } else {
        user_layer.remove();
        asset_opacity.hide();
        opacity_asset.hide();
    }
});

opacity_collection.change(function () {
    gee_layer.setOpacity($(this).val());
    collection_opacity.text(Math.round($(this).val() * 100) + "%");
});
opacity_asset.change(function () {
    user_layer.setOpacity($(this).val());
    asset_opacity.text(Math.round($(this).val() * 100) + "%");
});

osm.addTo(map);


// Finally append that node to the new parent, recursively searching out and re-parenting nodes.
function setParent(el, newParent) {
    newParent.appendChild(el);
}


var control1 = L.Control.geocoder({collapsed: false});

control1.addTo(map);


let layerControlDiv = control1.getContainer();

// you can set an id for it if you want to use it to override the CSS later
layerControlDiv.setAttribute("id", "layer-control-id-gee");

let layerControlParentLayer = L.control({
    position: "topright"
});
layerControlParentLayer.onAdd = function (map) {
    // Create the main div that will hold all your elements
    let parentDiv = L.DomUtil.create("a");

    // you can set an id for it if you want to use it for CSS
    parentDiv.setAttribute("id", "layer-control-parent-id-gee");
    parentDiv.appendChild(layerControlDiv);
    L.DomEvent.disableClickPropagation(parentDiv);
    return parentDiv;
};
// add the Layer to the map
layerControlParentLayer.addTo(map);
var htmlObject = layerControlParentLayer.getContainer();
var a = document.getElementById('location_gee');
setParent(htmlObject, a);

var terrainLayer = L.tileLayer(
    "https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    {
        attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'rU9sOZqw2vhWdd1iYYIFqXxstyXPNKIp9UKC1s8NQkl9epmf0YpFF8a2HX1sNMBM',
        opacity: 1,
        thumb: "img/terrain.png",
        displayName: "Terrain",
    }
);
var deLormeLayer = L.tileLayer.wms(
    "https://server.arcgisonline.com/arcgis/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",
    {
        format: "image/png",
        transparent: true,
        attribution:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/Reference/Specialty/DeLorme_World_Base_Map/MapServer">ArcGIS</a>',
        opacity: 1,
        thumb: "img/delorme.png",
        displayName: "DeLorme",
    }
);
var gSatLayer = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    {
        format: "image/png",
        transparent: true,
        attribution:
            'Tiles © Map data ©2019 Google',
        opacity: 1,
        thumb: "img/gsatellite.png",
        displayName: "Google Satellite",
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }
);

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


removeLayers = function () {
    satellite.remove();
    osm.remove();
    OpenTopoMap.remove();
    terrainLayer.remove();
    deLormeLayer.remove();
    gSatLayer.remove();
};

add_basemap = function (map_name) {
    removeLayers();

    switch (map_name) {
        case "osm":

            osm.addTo(map);
            // osm.bringToFront();

            break;
        case "delorme":
            deLormeLayer.addTo(map);
            break;
        case "satellite":
            satellite.addTo(map);
            break;

        case "terrain":
            terrainLayer.addTo(map);
            break;
        case "topo":
            OpenTopoMap.addTo(map);
            break;
        case "gsatellite":
            gSatLayer.addTo(map);
            break;
        default:
            osm.addTo(map);

    }
};

function add_legend(layer_vis_params) {

    // append a defs (for definition) element to your SVG
    var svgLegend = d3.select('#legend').append('svg')
        .attr("height", 250)
        .attr("width", 100)
        .attr("style", "background-color:#000000");
    var defs = svgLegend.append('defs');

    // append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append('linearGradient')
        .attr('id', 'linear-gradient');

    // horizontal gradient
    linearGradient
        .attr('id', 'Gradient2')
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");


    // append multiple color stops by using D3's data/enter step
    // these would have to be calculated from the layer_vis_params
    // this particular one has 4 colors in the palette, so the breaks
    // are 0, 33, 66, 100.  you would have to do a little math
    // to calculate the percentage for different number of colors
    // in a palette and assign the offset and color
    linearGradient.selectAll("stop")
        .data([
            {offset: "0%", color: "#1303ff"},
            {offset: "33%", color: "#42fff6"},
            {offset: "66%", color: "#f3ff40"},
            {offset: "100%", color: "#ff5d0f"}
        ])
        .enter().append("stop")
        .attr("offset", function (d) {
            return d.offset;
        })
        .attr("stop-color", function (d) {
            return d.color;
        });

    // append title
    svgLegend.append("text")
        .attr("class", "legendTitle")
        .style("fill", "#FFFFFF")
        .style("font-size", "12px")
        .attr("x", 3)
        .attr("y", 20)
        .attr("transform", "translate(100,10) rotate(90)")
        .style("text-anchor", "left")
        .text("Legend title"); //***replace Legend title with title passed in layer_vis_params***

    // draw the rectangle and fill with gradient
    svgLegend.append("rect")
        .attr("x", 2)
        .attr("y", 10)
        .attr("width", 20)
        .attr("height", 230)
        .style("fill", "url(#Gradient2)");

    //create tick marks
    var xLeg = d3.scaleLinear()
        .domain([258, 316]) // This is the min and max from the layer_vis_params
        .range([10, 240]);

    var axisLeg = d3.axisRight(xLeg);

    // I based this off of how many colors there are, both the number of ticks
    // and the tick values.  The tick values again will need a little math...
    axisLeg.ticks(4);
    axisLeg.tickValues([258, 277, 296, 316]);


    svgLegend
        .attr("class", "axis")
        .append("g")
        .attr("transform", "translate(16, 0)")
        .call(axisLeg);

    svgLegend.selectAll(".tick line")
        .attr("stroke-opacity", "0.0")
        .attr("stroke", "#000000");
    svgLegend.selectAll(".domain")
        .attr("stroke-opacity", "0.0")
        .attr("stroke", "#000000");
    svgLegend.selectAll(".tick text")
        .attr("fill", "#ffffff");
}