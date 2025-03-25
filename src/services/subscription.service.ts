import { Student } from "../entities/student/student.entity";
import { AppDataSource } from "../config/database.config";
import { University } from "../entities/university/university.entity";
import { StudentInterface } from "../interface/student.interface";
import HttpException from "../utils/HttpException.utils";
import BcryptService from "../utils/bcrypt.utils";
import { Subscription } from "../entities/Subscription/subscription.entity";

const bcryptService = new BcryptService();
class SubscriptionService {
  constructor(
    private readonly subscriptionRepo = AppDataSource.getRepository(
      Subscription
    )
  ) {}

  async addSubscription(data: any) {
    try {
      const addSubscription = this.subscriptionRepo.create({
        title: data.title,
        duration: Number(data.duration),
        bonus: Number(data.bonus),
        mostPoopular: data.mostPopular,
      });
      await this.subscriptionRepo.save(addSubscription);
      return addSubscription;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch Add Subscription"
      );
    }
  }
  async getSubscription() {
    try {
      const getSubscription = await this.subscriptionRepo.find();
      return getSubscription;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch get Subscription"
      );
    }
  }
}
export default SubscriptionService;
