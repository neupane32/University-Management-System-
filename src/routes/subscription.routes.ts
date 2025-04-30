import { authentication } from "../middleware/authentication.middleware";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { SubscriptionController } from "../controllers/subscription.controller";

const router: Router = Router();
const subscriptionController = new SubscriptionController;

router.use(authentication())

router.get('/get-subscription', catchAsync(subscriptionController.getSubscription));


router.use(authorization([Role.ADMIN]));

router.post('/add-subscription', catchAsync(subscriptionController.addSubscription));
router.patch('/update-subscription/:id', catchAsync(subscriptionController.updateSubscription));
router.delete('/delete-subscription/:id', catchAsync(subscriptionController.deleteSubscription));


router.post('/success', catchAsync(subscriptionController.addUniSubscription));



export default router;