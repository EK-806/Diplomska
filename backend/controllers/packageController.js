import Package from '../models/packageSchema.js';
import Rating from '../models/ratingSchema.js';
import Stripe from "stripe";
import Payment from '../models/paymentSchema.js';
import User from '../models/userSchema.js';
import { ErrorHandler } from "../middleware/error.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js"

export const CreatePackage = catchAsyncErrors(async (req, res, next) => {
  const {
    userId,
    senderFirstName,
    senderLastName,
    senderEmail,
    senderPhone,
    packageType,
    packageWeight,
    receiverFirstName,
    receiverLastName,
    receiverPhone,
    receiverEmail,
    deliveryAddress,
    deliveryLat,
    deliveryLng,
    cost,
    requestedDeliveryDate,
    approximateDeliveryDate,
    deliveryDriverId,
  } = req.body;

  if (
    !userId ||
    !senderFirstName ||
    !senderLastName ||
    !senderEmail ||
    !senderPhone ||
    !receiverFirstName ||
    !receiverLastName ||
    !receiverPhone ||
    !receiverEmail ||
    !deliveryAddress ||
    !packageType ||
    packageWeight == null ||
    requestedDeliveryDate == null ||
    deliveryLat == null ||
    deliveryLng == null
  ) {
    return next(new ErrorHandler("Missing required fields", 400));
  }

  const weightNum = Number(packageWeight);
  const latNum = Number(deliveryLat);
  const lngNum = Number(deliveryLng);
  const costNum = Number(cost);

  if (!Number.isFinite(weightNum) || weightNum <= 0) {
    return next(new ErrorHandler("Invalid packageWeight", 400));
  }
  if (!Number.isFinite(latNum) || latNum < -90 || latNum > 90) {
    return next(new ErrorHandler("Invalid deliveryLat", 400));
  }
  if (!Number.isFinite(lngNum) || lngNum < -180 || lngNum > 180) {
    return next(new ErrorHandler("Invalid deliveryLng", 400));
  }
  if (!Number.isFinite(costNum) || costNum < 0) {
    return next(new ErrorHandler("Invalid cost", 400));
  }

  const requestedDate = new Date(requestedDeliveryDate);
  if (!Number.isFinite(requestedDate.getTime())) {
    return next(new ErrorHandler("Invalid requestedDeliveryDate", 400));
  }

  const approxDate = approximateDeliveryDate ? new Date(approximateDeliveryDate) : null;
  if (approxDate && !Number.isFinite(approxDate.getTime())) {
    return next(new ErrorHandler("Invalid approximateDeliveryDate", 400));
  }

  const safeStatus = "Pending";

  const newPackage = new Package({
    userId,
    senderFirstName,
    senderLastName,
    senderEmail,
    senderPhone,
    packageType,
    packageWeight: weightNum,
    receiverFirstName,
    receiverLastName,
    receiverPhone,
    receiverEmail,
    deliveryAddress,
    deliveryLat: latNum,
    deliveryLng: lngNum,
    cost: costNum,
    requestedDeliveryDate: requestedDate,
    approximateDeliveryDate: approxDate,
    deliveryDriverId: deliveryDriverId || null,
    status: safeStatus,
  });

  const savedPackage = await newPackage.save();

  res.status(201).json({
    success: true,
    message: "Package created successfully!",
    data: savedPackage,
  });
});

export const UpdatePackage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const packageData = await Package.findById(id);

  if (!packageData) {
    return next(new ErrorHandler("Package not found!", 404));
  }

  if (packageData.status !== "Pending") {
    return next(
      new ErrorHandler(
        'Package can only be updated when status is "Pending"!',
        400
      )
    );
  }

  Object.keys(updates).forEach((key) => {
    packageData[key] = updates[key];
  });

  const updatedPackage = await packageData.save();

  res.status(200).json({
    success: true,
    message: "Package updated successfully!",
    data: updatedPackage,
  });
});

export const GetAllPackages = catchAsyncErrors(async (req, res, next) => {
    const packages = await Package.find().populate("userId").populate("deliveryDriverId");

    if (!packages || packages.length === 0) {
        return next(new ErrorHandler("No packages found", 404));
    }

    res.status(200).json({
        success: true,
        data: packages,
    });
});

export const GetPackageById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const packageData = await Package
    .findById(id)
    .populate('userId')
    .populate('deliveryDriverId');

  if (!packageData) {
    return next(new ErrorHandler('Package not found', 404));
  }

  res.status(200).json({
    success: true,
    data: packageData,
  });
});

export const GetMyPackages = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const packages = await Package.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Packages fetched successfully!",
    data: packages || [],
  });
});

export const CancelPackage = catchAsyncErrors(async (req, res, next) => {
  const { packageId } = req.params;
  const user = req.user;

  const packageData = await Package.findById(packageId);

  if (!packageData) {
    return next(new ErrorHandler('Package not found!', 404));
  }

  if (packageData.userId.toString() !== user._id.toString()) {
    return next(new ErrorHandler('You can only cancel your own packages.', 403));
  }

  if (!['Pending', 'On The Way'].includes(packageData.status)) {
    return next(
      new ErrorHandler(
        'You can only cancel packages that are in "Pending" or "On The Way" status.',
        400
      )
    );
  }

  packageData.status = 'Cancelled';
  await packageData.save();

  res.status(200).json({
    success: true,
    message: 'Package cancelled successfully.',
    data: packageData,
  });
});

export const FilterPackagesByDate = catchAsyncErrors(async (req, res, next) => {
  const { dateFrom, dateTo } = req.query;

  if (!dateFrom || !dateTo) {
    return next(new ErrorHandler('Both dateFrom and dateTo are required.', 400));
  }

  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return next(new ErrorHandler('Invalid date format.', 400));
  }

  const packages = await Package.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  if (!packages || packages.length === 0) {
    return next(
      new ErrorHandler('No packages found in the specified date range.', 404)
    );
  }

  res.status(200).json({
    success: true,
    count: packages.length,
    data: packages,
  });
});

export const AssignDeliveryDelivery = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { deliveryDriverId, deliveryDate } = req.body;

  if (!deliveryDriverId || !deliveryDate) {
    return next(
      new ErrorHandler('DeliveryDriverId and deliveryDate are required.', 400)
    );
  }

  const packageData = await Package.findById(id);

  if (!packageData) {
    return next(new ErrorHandler('Package not found.', 404));
  }

  if (['Delivered', 'Returned', 'Cancelled'].includes(packageData.status)) {
    return next(
      new ErrorHandler(
        'Cannot assign delivery driver to a package that is already delivered, returned, or cancelled.',
        400
      )
    );
  }

  packageData.deliveryDriverId = deliveryDriverId;
  packageData.approximateDeliveryDate = deliveryDate;
  packageData.status = 'On The Way';

  await packageData.save();

  res.status(200).json({
    success: true,
    message: 'Package updated successfully.',
    data: packageData,
  });
});

export const GetDeliveries = catchAsyncErrors(async (req, res, next) => {
  const deliveryDriverId = req.user._id;
  const { page, limit } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 0;
  const skip = (pageNumber - 1) * pageSize;

  const query = { deliveryDriverId };

  let packagesQuery = Package.find(query).sort({ createdAt: -1 });

  if (pageSize > 0) {
    packagesQuery = packagesQuery.skip(skip).limit(pageSize);
  }

  const packages = await packagesQuery;

  if (!packages || packages.length === 0) {
    return next(
      new ErrorHandler('No packages found for the delivery driver.', 404)
    );
  }

  res.status(200).json({
    success: true,
    message: 'Packages fetched successfully.',
    count: packages.length,
    data: packages,
  });
});

export const Rate = catchAsyncErrors(async (req, res, next) => {
    const { deliveryDriverId, packageId, rating, comment } = req.body;

    if (!deliveryDriverId || !packageId || !rating) {
        return next(
            new ErrorHandler(
                'deliveryDriverId, packageId, and rating are required.',
                400
            )
        );
    }

    const packageData = await Package.findOne({
        _id: packageId,
        deliveryDriverId,
        status: 'Delivered',
    });

    if (!packageData) {
        return next(
            new ErrorHandler(
                'Cannot add a rating. Package status must be Delivered.',
                400
            )
        );
    }

    const existingRating = await Rating.findOne({
        userId: req.user._id,
        deliveryDriverId,
        packageId,
    });

    if (existingRating) {
        return next(
            new ErrorHandler(
                'You have already rated the delivery driver for this package.',
                400
            )
        );
    }

    const rate = await Rating.create({
        userId: req.user._id,
        deliveryDriverId,
        packageId,
        rating,
        comment,
    });

    res.status(201).json({
        success: true,
        message: 'Rating added successfully!',
        data: rate,
    });
});

export const GetMyRatings = catchAsyncErrors(async (req, res, next) => {
  const deliveryDriverId = req.user._id;

  const ratings = await Rating.find({ deliveryDriverId })
    .populate("userId", "firstName lastName profilePicture")
    .sort({ ratingDate: -1 });

  if (!ratings.length) {
    return next(new ErrorHandler('No ratings found for this delivery driver.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Ratings fetched successfully!',
    ratings,
  });
});

export const UpdatePackageStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Status is required.", 400));
  }

  const allowedStatuses = [
    "Pending",
    "On The Way",
    "Delivered",
    "Returned",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return next(
      new ErrorHandler(
        `Invalid status. Allowed statuses are: ${allowedStatuses.join(", ")}`,
        400
      )
    );
  }

  const packageData = await Package.findById(id);
  if (!packageData) {
    return next(new ErrorHandler("Package not found.", 404));
  }

  const transitions = {
    Pending: ["On The Way", "Cancelled"],
    "On The Way": ["Delivered", "Returned", "Cancelled"],
    Delivered: [],
    Returned: [],
    Cancelled: [],
  };

  if (!transitions[packageData.status]?.includes(status)) {
    return next(
      new ErrorHandler(
        `Cannot transition from '${packageData.status}' to '${status}'.`,
        400
      )
    );
  }

  packageData.status = status;
  const updatedPackage = await packageData.save();

  res.status(200).json({
    success: true,
    message: "Package status updated successfully.",
    data: updatedPackage,
  });
});

export const GetSiteStats = catchAsyncErrors(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalPackages = await Package.countDocuments();
  const totalPackagesDelivered = await Package.countDocuments({
    status: 'Delivered',
  });

  if (totalUsers === null || totalPackages === null) {
    return next(new ErrorHandler('Failed to fetch site statistics.', 500));
  }

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalPackages,
      totalPackagesDelivered,
    },
  });
});

export const FilterTopDeliveryDrivers = catchAsyncErrors(async (req, res, next) => {
  const topDeliveryDrivers = await Package.aggregate([
    { $match: { status: 'Delivered', deliveryDriverId: { $ne: null } } },

    {
      $group: {
        _id: '$deliveryDriverId',
        totalPackagesDelivered: { $sum: 1 },
      },
    },

    {
      $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'deliveryDriverId',
        as: 'ratings',
      },
    },

    {
      $addFields: {
        averageRating: { $avg: '$ratings.rating' },
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'deliveryDriverDetails',
      },
    },

    { $unwind: '$deliveryDriverDetails' },

    {
      $sort: {
        totalPackagesDelivered: -1,
        averageRating: -1,
      },
    },

    { $limit: 3 },

    {
      $project: {
        _id: 0,
        deliveryDriverId: '$_id',
        firstName: '$deliveryDriverDetails.firstName',
        lastName: '$deliveryDriverDetails.lastName',
        profilePicture: '$deliveryDriverDetails.profilePicture',
        totalPackagesDelivered: 1,
        averageRating: { $ifNull: ['$averageRating', 0] },
      },
    },
  ]);

  if (!topDeliveryDrivers.length) {
    return next(new ErrorHandler('No delivery drivers found.', 404));
  }

  res.status(200).json({
    success: true,
    data: topDeliveryDrivers,
  });
});

export const GetStatsData = catchAsyncErrors(async (req, res, next) => {
  const deliveryData = await Package.aggregate([
    {
      $match: {
        appointedDate: { $type: "date" },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$appointedDate",
          },
        },
        appointedCount: {
          $sum: {
            $cond: [{ $in: ["$status", ["Pending", "On The Way"]] }, 1, 0],
          },
        },
        deliveredCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0],
          },
        },
        totalAppointed: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (!deliveryData.length) {
    return next(new ErrorHandler("No statistics data available.", 404));
  }

  res.status(200).json({
    success: true,
    data: {
      barChartData: deliveryData.map((item) => ({
        date: item._id,
        totalAppointed: item.totalAppointed,
      })),
      lineChartData: deliveryData.map((item) => ({
        date: item._id,
        appointed: item.appointedCount,
        delivered: item.deliveredCount,
      })),
    },
  });
});

export const PaymentHandler = catchAsyncErrors(async (req, res, next) => {
  const { packageId } = req.params;
  const { paymentId } = req.body;

  if (!packageId || !paymentId) {
    return next(new ErrorHandler("PackageId and paymentId are required.", 400));
  }

  const packageData = await Package.findById(packageId);
  if (!packageData) {
    return next(new ErrorHandler("Package not found.", 404));
  }

  packageData.paymentStatus = "Completed";
  packageData.paymentId = paymentId;
  await packageData.save();

  await Payment.findOneAndUpdate(
    {
      userId: packageData.userId,
      packageId: packageData._id,
    },
    {
      userId: packageData.userId,
      packageId: packageData._id,
      paymentAmount: Number(packageData.cost) || 0,
      paymentStatus: "Success",
      paymentIntentId: paymentId,
      paymentDate: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Payment stored successfully.",
  });
});

export const InitiatePayment = catchAsyncErrors(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { packageId, price } = req.body;

  if (!packageId || price == null) {
    return next(new ErrorHandler("packageId and price are required.", 400));
  }

  const amount = Math.round(Number(price) * 100);
  if (!Number.isFinite(amount) || amount <= 0) {
    return next(new ErrorHandler("Invalid price.", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    metadata: { packageId: String(packageId) },
  });

  return res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});