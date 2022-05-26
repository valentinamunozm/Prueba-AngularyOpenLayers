import { AfterViewInit, Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import {Icon,Style} from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  map!: Map;
  point2!: Feature;
  point1!: Feature;
  vectorSource! : VectorSource;
  constructor() {
    //
   }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit() {

    this.showPoints();

    this.vectorSource = new VectorSource({
      features: [this.point1, this.point2]
    });

    let vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.map = new Map({
      target: 'map',
      layers: [  new TileLayer({  source: new OSM()}), vectorLayer ],
      view: new View({
        center: fromLonLat([-36.1492374, 26.7800424]),
        zoom: 3
      })
    }); 
    setTimeout(() => {
      if (this.map) {  this.map.setTarget("map"); }
    }, 1000);

    this.showPopup();
  }

  showPoints(){

    this.point1 = new Feature({
      geometry : new Point(fromLonLat([-75.1000822, 7.7160739])),
      name: 'Colombia',
      informacion: 'Colombia es un país del extremo norte de Sudamérica. Su paisaje cuenta con bosques tropicales, las montañas de los Andes y varias plantaciones de café',
    });

    this.point1.setStyle(new Style ({
      image: new Icon(({
        crossOrigin: 'anonymous',
        src: '../../../assets/img/icon2.png',
        imgSize: [50, 50]
      }))
    }));

    this.point2 = new Feature({
      geometry : new Point(fromLonLat([-4.7213802, 42.2119489])),
      name: 'España',
      informacion: 'España, país de la península ibérica de Europa, incluye 17 regiones autónomas con diversas características geográficas y culturales.'
    });

    this.point2.setStyle(new Style ({
      image: new Icon(({
        crossOrigin: 'anonymous',
        src: '../../../assets/img/icon1.png',
        imgSize: [50, 50]
      }))
    }));
  }

  showPopup(){
    let container = document.getElementById('popup')!;
    let content_element = document.getElementById('popup-content')!;
    let closer = document.getElementById('popup-closer')!;

    let overlay = new Overlay({
        element: container,
        autoPan: true
    });

    this.map.addOverlay(overlay);

    this.map.on('click', evt => {
        let feature:any = this.map.forEachFeatureAtPixel(evt.pixel,
          function(feature) {
            return feature;
          });
        if (feature) {
          var geometry = feature.getGeometry();
          var coord = geometry.getCoordinates();

          var content = '<h2>' + feature.get('name') + '</h2>';
          content += '<p> <strong>Información resumida</strong></p>';
          content += '<p>' + feature.get('informacion') + '</>';
          content_element.innerHTML = content;
          overlay.setPosition(coord);

          console.info(feature.getProperties());
        }
    });

    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer!.blur();
      return false;
    };

    this.map.on('pointermove', e => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
  }
}
