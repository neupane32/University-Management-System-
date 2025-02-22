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
    private readonly subscriptionRepo = AppDataSource.getRepository(Subscription),
   
  ) {}

  async addSubscription(data: any){
    
    const addSubscription = this.subscriptionRepo.create({
        title: data.title,
        duration: Number(data.duration),
        bonus: Number(data.bonus),
        mostPoopular: data.mostPopular

      });
      await this.subscriptionRepo.save(addSubscription);
      return addSubscription;
  }

  async getSubscription(){
    
    const getSubscription = await this.subscriptionRepo.find()
    return getSubscription;
  }

  
  }



export default SubscriptionService;
