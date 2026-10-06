# Production Readiness Scoring Methodology

## Scoring Logic
The readiness score reflects the operational preparedness of a software project before launching into production.

$$ \text{Readiness Score (\%)} = \left( \frac{\sum \text{Points of Completed Items}}{\sum \text{Total Applicable Points}} \right) \times 100 $$

## Status Classifications
- **Passed / Completed**: Full weight awarded.
- **In Progress**: Partial credit (if configured).
- **Not Started**: 0 points awarded.
- **Not Applicable (N/A)**: Excluded from the denominator.

## Tiers & Thresholds
- **Tier 1 (Mission-Critical)**: Requires >= 95% overall score and 100% security item compliance.
- **Tier 2 (Standard Service)**: Requires >= 85% overall score.
- **Tier 3 (Internal / Prototype)**: Requires >= 70% overall score.
