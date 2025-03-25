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
    console.log("🚀 ~ SubscriptionService ~ addSubscription ~ data:", data)
    try {
console.log(typeof(data.mostPopular),'------')
      const addSubscription = this.subscriptionRepo.create({
        title: data.title,
        duration: Number(data.duration),
        bonus: Number(data.bonus),
        mostPopular: Boolean(data.mostPopular),
        price:Number(data.price)
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
      const id = "372f3fe8-ad30-4b36-b811-22ea984055eb"
      const getSubscription = await this.subscriptionRepo.find();
      console.log("🚀 ~ SubscriptionService ~ getSubscription ~ getSubscription:", getSubscription)
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
