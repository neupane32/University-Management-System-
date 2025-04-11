// src/services/cron.service.ts
import schedule from "node-schedule";
// import Print from '../utils/print';

export class CronService {
  constructor() {
    this.initializeJobs();
  }

  private initializeJobs() {
    // Example: Run every minute
    schedule.scheduleJob("* * * * *", () => {
      console.info("[CRON] Running a job every minute");
      // You can call other services/methods here
    });
  }
  
}
