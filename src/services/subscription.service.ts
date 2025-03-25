import { Student } from "../entities/student/student.entity";
import { AppDataSource } from "../config/database.config";
import { University } from "../entities/university/university.entity";
import { StudentInterface } from "../interface/student.interface";
import HttpException from "../utils/HttpException.utils";
import BcryptService from "../utils/bcrypt.utils";
import { Subscription } from "../entities/Subscription/subscription.entity";
import { UniversitySubscription } from "../entities/UniSubscription/unisubscription.entity";

const bcryptService = new BcryptService();
class SubscriptionService {
  constructor(
    private readonly subscriptionRepo = AppDataSource.getRepository(
      Subscription
    ),
    private readonly uniSubscriptionRepo = AppDataSource.getRepository(
      UniversitySubscription
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
  async addUniSubscription(data: any, uni_id: string) {
    const subscriptionId = data.id;
    console.log("🚀 ~ SubscriptionService ~ addUniSubscription ~ subscriptionId:", subscriptionId);

    // Fetch the subscription
    const subscription = await this.subscriptionRepo.findOne({
        where: { id: subscriptionId }
    });

    if (!subscription) {
        throw new Error('Subscription not found');
    }

    // Check if university already has a subscription
    const existingSubscription = await this.uniSubscriptionRepo.findOne({
        where: {
            university: { id: uni_id },
            isActive: true  // Ensure you are checking only active subscriptions
        }
    });

    if (existingSubscription) {
        throw new Error('University already has an active subscription');
    }

    console.log("🚀 ~ SubscriptionService ~ addUniSubscription ~ subscription:", subscription);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + subscription.duration);

    const newUniSubscription = this.uniSubscriptionRepo.create({
        startDate,
        endDate,
        isActive: true,
        university: { id: uni_id },
        subscription: { id: subscriptionId }
    });

    // Save the new subscription
    await this.uniSubscriptionRepo.save(newUniSubscription);

    console.log(`Subscription added successfully for university ID: ${uni_id}`);
}


}
export default SubscriptionService;
