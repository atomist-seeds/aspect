import { configureAspects } from "@atomist/sdm-pack-aspect";
import { LicenseAspect } from "./lib/license";

// Main entry point into the SDM
export const configuration = configureAspects(LicenseAspect)
