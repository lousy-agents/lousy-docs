---
applyTo: ".github/workflows/*.{yml,yaml}"
---

# Pipeline Instructions

## After Modifying Workflows

Run these validation commands in order. Both catch errors that GitHub reports only after a push, so running them locally saves a round trip through a failing run:

```bash
npm run lint:workflows  # Validate GitHub Actions workflows with actionlint
npm run lint:yaml       # Validate YAML syntax with yamllint
```

## Workflow Structure Requirements

1. Every CI workflow that builds, tests, or lints code shall include at least one test job and one lint job. Where a utility workflow exists that does none of those things (`copilot-setup-steps.yml`, for example, which only prepares an environment), it is exempt.
2. Reference the Node.js version from `.nvmrc` using `actions/setup-node` with the `node-version-file` input, so that the workflow and local development cannot drift onto different Node versions.
3. Prefer official actions maintained by GitHub (`actions/checkout`, `actions/setup-node`, `actions/upload-artifact`, `actions/download-artifact`) over third-party equivalents. `actions/setup-node` already caches npm through its `cache: 'npm'` input, so a separate `actions/cache` step is redundant.

## The Aggregating Status Job

`ci.yml` ends with a `status` job that runs `if: always()`, needs the other check jobs in that workflow (`lint`, `test`, `test-e2e`, `build`), and fails when any of them did not succeed. It exists so that branch protection has one required check to name for this workflow, instead of a list that has to be updated in the repository settings every time a job is added. `deploy` is excluded because it depends on `status` rather than feeding it.

If you add a job to `ci.yml`, add it to the `status` job's `needs` list and to the array it checks. A job left out of `status` still runs and still reports, but it cannot block a merge, so a failure in it is invisible to branch protection.

`status` aggregates `ci.yml` only. Code scanning runs from GitHub's default setup rather than a workflow file in this repository, so its `Analyze` check appears on pull requests under its own workflow run and is not covered by `status`. Branch protection names that check separately.

## Action Pinning Format

Pin all third-party actions to an exact commit SHA with a version comment. A tag is mutable and can be repointed at new code, so the SHA is what makes the build reproducible and resistant to a compromised upstream release. The comment is what makes the pin legible to a human and updatable by Renovate.

```yaml
# CORRECT format:
uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1  # v7.0.1

# INCORRECT formats (do NOT use):
uses: actions/checkout@v7        # ❌ version tag only
uses: actions/checkout@v7.0.1    # ❌ version tag only
uses: actions/checkout@main      # ❌ branch reference
```

Before adding any action:
1. Check GitHub for the latest stable version
2. Find the full commit SHA for that version
3. Add both SHA and version comment

## Runner Requirements

Use `ubuntu-latest` for all jobs. A workflow that needs a different runner should say why in a comment, because an unexplained runner change is indistinguishable from a mistake.

## Secrets in Workflows

`DOCS_GITHUB_TOKEN` is required by any job running `npm run build` or `npm run test:e2e:dist`, because `scripts/fetch-docs.sh` uses it to clone the documentation source. Variables prefixed `PUBLIC_` (`PUBLIC_CF_BEACON_TOKEN`, `PUBLIC_GOOGLE_SITE_VERIFICATION_TOKEN`) are inlined into the client bundle by Astro at build time and are public by design, which is why they are repository variables rather than secrets. Never pass a real credential through a `PUBLIC_` variable.
