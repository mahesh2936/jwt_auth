const express = require('express');
const config = require('utility/config/config');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const propertyRoute = require('./property.route');
const rulesRoute = require('./rules.route');
const notificationRoute = require('./notification.route');
const tenantProfileRoute = require('./tenant.route');
const landlordProfileRoute = require('./landlord.route');
const partnerProfileRoute = require('./partner.route');
const internalProfileRoute = require('./internal.route');
const dashboardRoute = require('./dashboard.route');
const webHookRoute = require('./webhooks.route');
const verifyRoute = require('./verify.route');

const uploadRoute = require('./upload.route');
const downloadRoute = require('./download.route');
const docsRoute = require('./docs.route');
const adhaarRoute = require('./adhaar.route');
const panRoute = require('./pan.route');
const idcraRoute = require('./idcra.route');
const utilityRoute = require('./utility.route');
const eligibilityRoute = require('./eligibility.route');
const invitationRoute = require('./invitation.route');
const emailRoute = require('./email.route');
const walletRoute = require('./wallet.route');
const consentRoute = require('./consent.route');
const newsRoute = require('./news.route');
const leadsRoute = require('./leads.route');
const requestRoute = require('./request.route');
const referralRoute = require('./referral.route');
const inspectionRoute = require('./inspection.route');
const applicantRoute = require('./applicant.route');
const crimereportingRoute = require('./crimereporting.route');

const equifaxlogRoute = require('./equifaxlog.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/equifax/logs',
    route: equifaxlogRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/crime/reporting',
    route: crimereportingRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/requests',
    route: requestRoute,
  },
  {
    path: '/profile/landlord',
    route: landlordProfileRoute,
  },
  {
    path: '/inspections',
    route: inspectionRoute,
  },
  {
    path: '/profile/tenant',
    route: tenantProfileRoute,
  },
  {
    path: '/profile/partner',
    route: partnerProfileRoute,
  },
  {
    path: '/profile/internal',
    route: internalProfileRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/download',
    route: downloadRoute,
  },
  {
    path: '/property',
    route: propertyRoute,
  },
  {
    path: '/verify',
    route: verifyRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/rules',
    route: rulesRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/adhaar',
    route: adhaarRoute,
  },
  {
    path: '/pan',
    route: panRoute,
  },
  {
    path: '/idcra',
    route: idcraRoute,
  },
  {
    path: '/utility',
    route: utilityRoute,
  },
  {
    path: '/eligibility',
    route: eligibilityRoute,
  },
  {
    path: '/invitation',
    route: invitationRoute,
  },
  {
    path: '/email',
    route: emailRoute,
  },
  {
    path: '/wallet',
    route: walletRoute,
  },
  {
    path: '/consent',
    route: consentRoute,
  },
  {
    path: '/notification',
    route: notificationRoute,
  },
  {
    path: '/webhooks',
    route: webHookRoute,
  },
  {
    path: '/news',
    route: newsRoute,
  },
  {
    path: '/leads',
    route: leadsRoute,
  },
  {
    path: '/referral',
    route: referralRoute,
  },
  {
    path: '/applicant',
    route: applicantRoute,
  },
];

const devRoutes = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
