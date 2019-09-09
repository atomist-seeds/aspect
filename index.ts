import { configureAspects } from "./lib/configureAspects";
import { LicenseAspect } from "./lib/license";

// Main entry point into the SDM
export const configuration = configureAspects(LicenseAspect)
