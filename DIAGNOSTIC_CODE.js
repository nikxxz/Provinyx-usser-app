/**
 * Google Sign-In Diagnostic Helper
 * Add this temporarily to OnboardingScreen to debug the issue
 */

// Add this inside handleGoogleLogin, right at the start:

const handleGoogleLogin = async () => {
  try {
    setIsGoogleLoading(true);

    // DIAGNOSTIC: Log configuration
    console.log('=== GOOGLE SIGN-IN DIAGNOSTICS ===');
    console.log('Package Name: com.unveilix');
    console.log('SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25');
    console.log('Web Client ID: 998554587608-bf7td2slo768kopvdr30rs9tu7l3gbem.apps.googleusercontent.com');
    
    // Check if GoogleSignin is configured
    const currentUser = await GoogleSignin.getCurrentUser();
    console.log('Current user:', currentUser);

    // Rest of the code...
