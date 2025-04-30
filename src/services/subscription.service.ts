import { AppDataSource } from "../config/database.config";
import { University } from "../entities/university/university.entity";
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
    ),
    private readonly uniRepo = AppDataSource.getRepository(University)
  ) {}

  async addSubscription(data: any) {
    console.log("🚀 ~ SubscriptionService ~ addSubscription ~ data:", data);
    try {
      console.log(typeof data.mostPopular);
      const addSubscription = this.subscriptionRepo.create({
        title: data.title,
        duration: Number(data.duration),
        bonus: Number(data.bonus),
        mostPopular: Boolean(data.mostPopular),
        price: Number(data.price),
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
      console.log(
        "🚀 ~ SubscriptionService ~ getSubscription ~ getSubscription:",
        getSubscription
      );
      return getSubscription;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch get Subscription"
      );
    }
  }

  async updateSubscription(subscription_id: string, data: any) {
    try {
      const subscription = await this.subscriptionRepo.findOne({
        where: { id: subscription_id },
      });

      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const updatedSubscription = await this.subscriptionRepo.update(
        {
          id: subscription_id,
        },
        {
          title: data.title,
          duration: Number(data.duration),
          bonus: Number(data.bonus),
          mostPopular: Boolean(data.mostPopular),
          price: Number(data.price),
        }
      );
      return updatedSubscription;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch update Subscription"
      );
    }
  }

  async deleteSubscription(subscription_id: string) {
    try {
      const subscription = await this.subscriptionRepo.findOne({
        where: { id: subscription_id },
      });

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      await this.subscriptionRepo.delete(subscription_id);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch delete Subscription"
      );
    }
  }

  async addUniSubscription(data: any, uni_id: string) {
    const subscriptionId = data.id;
    console.log(
      "🚀 ~ SubscriptionService ~ addUniSubscription ~ subscriptionId:",
      subscriptionId
    );

    const subscription = await this.subscriptionRepo.findOne({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const existingSubscription = await this.uniSubscriptionRepo.findOne({
      where: {
        university: { id: uni_id },
        isActive: true,
      },
    });

    if (existingSubscription) {
      throw new Error("University already has an active subscription");
    }

    console.log(
      "🚀 ~ SubscriptionService ~ addUniSubscription ~ subscription:",
      subscription
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + subscription.duration);

    const newUniSubscription = this.uniSubscriptionRepo.create({
      startDate,
      endDate,
      isActive: true,
      university: { id: uni_id },
      subscription: { id: subscriptionId },
    });
    await this.uniSubscriptionRepo.save(newUniSubscription);

    console.log(`Subscription added successfully for university ID: ${uni_id}`);
  }

  async getSubscriptionTime(uni_id: string) {
    try {
      const activeSubscription = await this.uniSubscriptionRepo.findOne({
        where: {
          university: { id: uni_id },
        },
      });

      if (!activeSubscription) {
        throw new Error("No active subscription found for this university");
      }

      const currentDate = new Date();
      let timeLeftMs =
        activeSubscription.endDate.getTime() - currentDate.getTime();

      if (timeLeftMs <= 0) {
        activeSubscription.isActive = false;
        await this.uniSubscriptionRepo.save(activeSubscription);
        timeLeftMs = 0;
      }

      const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    } catch (error) {
      console.log("🚀 ~ getSubscriptionTime ~ error:", error);
    }
  }
}
export default SubscriptionService;
