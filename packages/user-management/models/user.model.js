const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    facebookId: {
      type: String,
      trim: true,
    },
    googleId: {
      type: String,
      trim: true,
    },
    externalId: {
      type: String,
    },
    referCode: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,
      // required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    dob: {
      type: Date,
    },
    docs: [TypeDoc],
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate(value) {
        if (!value.toString().match(/\d/)) {
          throw new Error('Enter a valid mobile number');
        }
      },
    },
    userType: {
      type: String,
      enum: Object.values(UserTypes),
      default: UserTypes.NONE,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    employmentDetails: {
      type: TypeEmployment,
      default: {},
    },
    businessDetails: {
      type: TypeBusiness,
      default: {},
    },
    userPanEnail: {
      type: String,
    },
    instituteName: {
      type: String,
    },
    type: {
      type: String,
      default: landlordTenantTypeEnum.INDIVIDUAL,
      enum: Object.values(landlordTenantTypeEnum),
    },
    isResident: {
      type: Boolean,
      default: false,
    },
    consent: {
      type: Boolean,
      default: false,
    },
    lastCompletedStep: {
      type: Number,
      default: 0,
    },
    completedPerc: {
      type: Number,
      default: 90,
    },
    profileId: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(GenderTypes),
    },
    isNewProductOpted: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
    },
    crmId: {
      type: String,
      trim: true,
      default: '',
    },
    modifiedBy: {
      type: String,
      trim: true,
    },
    signupCity: {
      type: String,
      default: '',
    },
    userPanName: {
      type: String,
    },
    userPanAdhaar: {
      type: String,
    },
    userPanphone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const options = {
  mongoose, // A mongoose instance
  userCollection: 'users', // Colletcion to ref when you pass an user id
  userCollectionIdType: false, // Type for user collection ref id, defaults to ObjectId
  userFieldName: 'user', // Name of the property for the user
  timestampFieldName: 'timestamp', // Name of the property of the timestamp
  methodFieldName: 'method', // Name of the property of the method
  noDiffSave: false, // If true save event even if there are no changes
  noDiffSaveOnMethods: ['delete'],
  noEventSave: true, // If false save only when __history property is passed
  modelName: '__histories_users', // Name of the collection for the histories
  ignorePopulatedFields: true,
};

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(usersPaginate);
userSchema.plugin(MongooseHistoryPlugin(options));

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if phone is taken
 * @param {string} phone - The user's phone
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if work email is taken
 * @param {string} workEmail - The partner's work email
 * @param {ObjectId} [excludeTenantId] - The id of the partner to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isWorkEmailTaken = async function (workEmail, excludeUserId) {
  const user = await this.findOne({ 'employmentDetails.workEmail': workEmail, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

/**
 * @typedef User
 */

module.exports = User;
