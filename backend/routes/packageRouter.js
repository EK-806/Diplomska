import express from 'express';
import {
    CreatePackage,
    GetMyPackages,
    GetAllPackages,
    GetPackageById,
    UpdatePackage,
    CancelPackage,
    FilterPackagesByDate,
    AssignDeliveryDelivery,
    GetDeliveries,
    Rate,
    GetMyRatings,
    UpdatePackageStatus,
    GetSiteStats,
    FilterTopDeliveryDrivers,
    GetStatsData,
    PaymentHandler,
    InitiatePayment
} from '../controllers/packageController.js';import { isAuthenticated } from '../middleware/auth.js';

const packageRouter = express.Router();

packageRouter.post('/create-package', CreatePackage);
packageRouter.get('/all-packages', GetAllPackages);
packageRouter.get('/package/:id', GetPackageById);
packageRouter.put('/update-package/:id', UpdatePackage);
packageRouter.get('/my-packages/:userId', GetMyPackages);
packageRouter.get('/filter-by-date', FilterPackagesByDate);
packageRouter.patch('/assign-delivery/:id', AssignDeliveryDelivery);
packageRouter.delete('/cancel-package/:packageId', isAuthenticated, CancelPackage);
packageRouter.get('/deliveries', isAuthenticated, GetDeliveries);
packageRouter.post('/ratings', isAuthenticated, Rate);
packageRouter.get('/ratings/ratings', isAuthenticated, GetMyRatings);
packageRouter.patch('/:id/status', UpdatePackageStatus);
packageRouter.get('/site-stats', GetSiteStats);
packageRouter.get('/top-delivery-drivers', FilterTopDeliveryDrivers);
packageRouter.get('/stats-data', GetStatsData);
packageRouter.post('/payment/:packageId', PaymentHandler);
packageRouter.post("/initiate-payment", InitiatePayment);

export default packageRouter;