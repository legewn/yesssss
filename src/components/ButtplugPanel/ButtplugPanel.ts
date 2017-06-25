import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator'
import { ButtplugClient, Device, Log } from "buttplug";
import ButtplugConnectionManagerComponent from '../ButtplugConnectionManager/ButtplugConnectionManager.vue';
import ButtplugLogManagerComponent from '../ButtplugLogManager/ButtplugLogManager.vue';
import ButtplugDeviceManagerComponent from '../ButtplugDeviceManager/ButtplugDeviceManager.vue';

@Component({
  components: {
    ButtplugConnectionManagerComponent,
    ButtplugLogManagerComponent,
    ButtplugDeviceManagerComponent
  }
})
export default class ButtplugPanel extends Vue {
  @Prop()
  buttplugClient: ButtplugClient;

  logMessages: Array<string> = [];
  devices: Array<Device> = [];

  async Connect(address: string) {
    await this.buttplugClient.Connect(address);
    this.buttplugClient.addListener('log', this.AddLogMessage);
    this.buttplugClient.addListener('deviceadded', this.AddDevice);
    this.buttplugClient.addListener('deviceremoved', this.RemoveDevice);
    await this.buttplugClient.RequestDeviceList();
  }

  async SetLogLevel(logLevel: string) {
    await this.buttplugClient.RequestLog(logLevel);
  }

  async StartScanning() {
    await this.buttplugClient.StartScanning();
  }

  async StopScanning() {
    await this.buttplugClient.StopScanning();
  }

  AddLogMessage(logMessage: Log) {
    this.logMessages.push(logMessage.LogMessage);
  }

  DeviceAlreadyAdded(device: Device) : boolean {
    return this.devices.filter((d) => { return device.Index === d.Index }).length !== 0;
  }

  AddDevice(device: Device) {
    if (!this.DeviceAlreadyAdded(device))
    {
      this.devices.push(device);
    }
  }

  RemoveDevice(device: Device) {
    if (this.devices.indexOf(device) !== -1) {
      this.devices.splice(this.devices.indexOf(device), 1);
    }
  }
}
