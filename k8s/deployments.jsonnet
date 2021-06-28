local deployment = import "../../releng/hugo-websites/kube-deployment.jsonnet";

deployment.newProductionDeploymentWithStaging(
  "ecdtools.eclipse.org", "ecdtools-staging.eclipse.org"
)