import { PushImpact } from "@atomist/sdm";
import { configure } from "@atomist/sdm-core";
import { DeliveryGoals } from "@atomist/sdm-core/lib/machine/configure";
import {
    aspectSupport,
    enrich,
} from "@atomist/sdm-pack-aspect";
import {
    RebaseFailure,
    RebaseStrategy,
} from "@atomist/sdm-pack-fingerprint";
import { LicenseAspect } from "./lib/license";

// This SDM only has a single PushImpact goal which is used
// to run your aspects on Git pushes
interface AnalyzeGoals extends DeliveryGoals {

    pushImpact: PushImpact;
}

// Main entry point into the SDM
export const configuration = configure<AnalyzeGoals>(async sdm => {

    // This creates and configures the goal instance
    const goals = await sdm.createGoals(async () => ({ pushImpact: new PushImpact() }));

    // This installs the required extension pack into the SDM
    // to run aspects and expose the local web ui for testing
    sdm.addExtensionPacks(
        aspectSupport({

            // Pass the aspects you want to run in this SDM
            aspects: enrich(
                LicenseAspect,
                {
                    description: "Repository licenses as detected by GitHub",
                    shortName: "gh-license",
                    unit: "gh-license",
                    category: "GitHub",
                    url: `fingerprint/${LicenseAspect.name}/${LicenseAspect.name}?byOrg=true&trim=false`,
                    manage: true,
                }),

            // Pass the PushImpact goal into the aspect support for it
            // to get configured
            goals,

            // Configure how existing branches should be rebased
            // during aspect apply executions
            rebase: {
                rebase: true,
                rebaseStrategy: RebaseStrategy.Ours,
                onRebaseFailure: RebaseFailure.DeleteBranch,
            },
        }),
    );

    // Return a signal goal set to run the push impact goal
    // on any push
    return {
        analyze: {
            goals: goals.pushImpact,
        },
    };
});
