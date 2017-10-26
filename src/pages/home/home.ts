import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  Geolocation,
  GeolocationOptions,
  Geoposition
} from '@ionic-native/geolocation';
import { LocationService } from '../../providers/location.service'
import { Device } from '@ionic-native/device';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  options: GeolocationOptions;
  currentPosition;
  locationHistory: any[] = [];

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public locationService: LocationService,
    private device: Device
  ) {

  }

  startLocationMonitoring() {
    this.options = { enableHighAccuracy: true }
    this.currentPosition = this.geolocation.watchPosition(this.options)
      .subscribe(
        (location: Geoposition) => {
        const {
            latitude,
            longitude,
            accuracy,
            altitude,
            altitudeAccuracy,
            heading,
            speed
          } = location.coords
          const { manufacturer, model, platform, version } = this.device;
          this.locationService.sendLocation({ latitude, longitude, altitude, manufacturer, model, platform, version })
          .subscribe(
            (success) => {
              this.locationHistory.push({latitude, longitude})
            }
          )
        }
      )

  }

  stopLocationMonitoring() {
    this.locationHistory = [];
    this.currentPosition.unsubscribe();
  }

}
