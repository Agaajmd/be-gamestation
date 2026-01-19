import { TimeSlot } from "../../../helper/generateTimes";

export type GetAvailableTimesResult = {
  timeSlots: TimeSlot[];
  totalDevices: number;
};