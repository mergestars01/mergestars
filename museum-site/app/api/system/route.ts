import { apiJson, requireApiIdentity } from "@/lib/api-guards";
import { featureStatuses } from "@/lib/draft-contract";
import { CORE_ORIGIN, coreDependencies, unavailableCoreCapability } from "@/lib/core-contract";

export async function GET() {
  if (!await requireApiIdentity()) return apiJson({ error: "AUTH_REQUIRED" }, 401);
  return apiJson({ architecture: "CORE_IS_SYSTEM_OF_RECORD", core_connected: false, core_origin: CORE_ORIGIN, public_read_interfaces: ["catalog", "collection", "prices"], public_read_health: "CHECK_PER_REQUEST", shared_session_connected: false, real_orders_enabled: false, real_payments_enabled: false, production_authorization_enabled: false, unavailable_capabilities: coreDependencies.map(unavailableCoreCapability), feature_statuses: featureStatuses });
}
