const DEFAULT_ADMIN_SECRET = "vagnerzezo";

function getAdminSecret() {
  return process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;
}

function requireAdmin(req, res, next) {
  const secret = getAdminSecret();
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const key = bearer || req.headers["x-admin-key"] || "";

  if (!key || key !== secret) {
    return res.status(401).json({ erro: "Não autorizado" });
  }

  return next();
}

module.exports = { requireAdmin, getAdminSecret };
