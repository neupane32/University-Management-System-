import { type NextFunction, type Request, type Response } from 'express';
import { type Role } from '../constant/enum';
import { AppDataSource } from "../config/database.config";
import { UniversitySubscription } from '../entities/UniSubscription/unisubscription.entity';

export const subscriptionAuthorization = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error('You are not authorized');
    try {
      const uni_id = req.user.id;
      const uniSubscriptionRepo = AppDataSource.getRepository(UniversitySubscription);

      // Retrieve the subscription
      let existingSubscription = await uniSubscriptionRepo.findOne({
        where: {
          university: { id: uni_id },
        },
      });

      const currentDate = new Date();

      // Check if subscription exists
      if (!existingSubscription) {
        return res.status(403).json({ message: 'No subscription found' });
      }

      // If isActive is false but the endDate is still in the future, reactivate the subscription
      if (!existingSubscription.isActive && existingSubscription.endDate > currentDate) {
        existingSubscription.isActive = true;
        await uniSubscriptionRepo.save(existingSubscription);
      }

      // Check if the subscription is active and valid
      if (existingSubscription.isActive) {
        if (existingSubscription.endDate < currentDate) {
          // Deactivate the subscription if expired
          existingSubscription.isActive = false;
          await uniSubscriptionRepo.save(existingSubscription);
          return res.status(403).json({ message: 'Subscription has expired' });
        }

        // Proceed if the subscription is valid
        return next();
      }

      // Handle case where subscription is inactive and not reactivated
      return res.status(403).json({ message: 'Subscription is inactive' });
    } catch (error) {
      throw new Error('You are not authorized');
    }
  };
};
