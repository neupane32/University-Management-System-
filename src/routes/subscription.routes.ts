import { authentication } from "../middleware/authentication.middleware";
import { StudentController } from "../controllers/student.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { SubscriptionController } from "../controllers/subscription.controller";

const router: Router = Router();
const subscriptionController = new SubscriptionController;





router.post('/add-subscription', catchAsync(subscriptionController.addSubscription));
router.get('/get-subscription', catchAsync(subscriptionController.getSubscription));

router.use(authentication())
router.use(authorization([Role.UNIVERSITY]));
router.post('/success', catchAsync(subscriptionController.addUniSubscription));
router.post('/Khalti-subscription', catchAsync(subscriptionController.initiatePayment));


export default router;