const prisma = require("../prisma");

const DEFAULT_USER_ID = "default";

/** ISO weekday: Monday = 1 … Sunday = 7 */
function isoWeekday(date) {
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
}

/** Parse YYYY-MM-DD as UTC midnight Date */
function parseDateOnly(value) {
  if (!value || typeof value !== "string") {
    throw new Error("Data do check-in é obrigatória");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Data do check-in é obrigatória (use YYYY-MM-DD)");
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Data do check-in inválida");
  }
  return date;
}

function toDateOnlyString(date) {
  return date.toISOString().slice(0, 10);
}

/** Monday 00:00 UTC of the week containing `date` */
function startOfWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = isoWeekday(d);
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d;
}

function endOfWeek(date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return end;
}

function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function uniqueDayKeys(checkins) {
  return [...new Set(checkins.map((c) => toDateOnlyString(c.checkinDate)))].sort();
}

function longestStreak(sortedDayKeys) {
  if (sortedDayKeys.length === 0) return 0;
  let best = 1;
  let current = 1;
  for (let i = 1; i < sortedDayKeys.length; i++) {
    const prev = new Date(`${sortedDayKeys[i - 1]}T00:00:00.000Z`);
    const curr = new Date(`${sortedDayKeys[i]}T00:00:00.000Z`);
    const diff = (curr - prev) / 86_400_000;
    if (diff === 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

function currentStreak(sortedDayKeys, today = new Date()) {
  if (sortedDayKeys.length === 0) return 0;
  const set = new Set(sortedDayKeys);
  let cursor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const todayKey = toDateOnlyString(cursor);
  if (!set.has(todayKey)) {
    cursor = addDays(cursor, -1);
    if (!set.has(toDateOnlyString(cursor))) return 0;
  }
  let streak = 0;
  while (set.has(toDateOnlyString(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

async function listCheckins({ userId = DEFAULT_USER_ID, treinoId, from, to } = {}) {
  const where = { userId, completed: true };
  if (treinoId) where.treinoId = treinoId;
  if (from || to) {
    where.checkinDate = {};
    if (from) where.checkinDate.gte = parseDateOnly(from);
    if (to) where.checkinDate.lte = parseDateOnly(to);
  }
  return prisma.trainingCheckin.findMany({
    where,
    orderBy: [{ checkinDate: "asc" }],
  });
}

async function listWeekCheckins({ userId = DEFAULT_USER_ID, date } = {}) {
  const ref = date ? parseDateOnly(date) : new Date();
  const from = startOfWeek(ref);
  const to = endOfWeek(ref);
  return listCheckins({
    userId,
    from: toDateOnlyString(from),
    to: toDateOnlyString(to),
  });
}

async function createCheckin({ userId = DEFAULT_USER_ID, treinoId, checkinDate }) {
  const date = parseDateOnly(checkinDate);
  const workoutId = treinoId?.trim() || null;

  if (workoutId) {
    const treino = await prisma.treino.findUnique({ where: { id: workoutId } });
    if (!treino) {
      const err = new Error("Treino não encontrado");
      err.code = "P2025";
      throw err;
    }
  }

  return prisma.trainingCheckin.upsert({
    where: {
      userId_checkinDate: {
        userId,
        checkinDate: date,
      },
    },
    create: {
      userId,
      treinoId: workoutId,
      checkinDate: date,
      weekday: isoWeekday(date),
      completed: true,
    },
    update: {
      completed: true,
      weekday: isoWeekday(date),
      ...(workoutId ? { treinoId: workoutId } : {}),
    },
  });
}

async function getStats({ userId = DEFAULT_USER_ID, date } = {}) {
  const ref = date ? parseDateOnly(date) : new Date();
  const today = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate()));

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  const [monthCheckins, weekCheckins, allCheckins] = await Promise.all([
    listCheckins({
      userId,
      from: toDateOnlyString(monthStart),
      to: toDateOnlyString(monthEnd),
    }),
    listCheckins({
      userId,
      from: toDateOnlyString(weekStart),
      to: toDateOnlyString(weekEnd),
    }),
    listCheckins({ userId }),
  ]);

  const monthDays = uniqueDayKeys(monthCheckins);
  const allDays = uniqueDayKeys(allCheckins);
  const daysElapsed = Math.min(today.getUTCDate(), monthEnd.getUTCDate());
  const monthPercent =
    daysElapsed > 0 ? Math.round((monthDays.length / daysElapsed) * 1000) / 10 : 0;

  return {
    monthTotal: monthCheckins.length,
    weekTotal: weekCheckins.length,
    currentStreak: currentStreak(allDays, today),
    monthPercent,
    bestStreak: longestStreak(allDays),
    weekStart: toDateOnlyString(weekStart),
    weekEnd: toDateOnlyString(weekEnd),
    monthStart: toDateOnlyString(monthStart),
    monthEnd: toDateOnlyString(monthEnd),
  };
}

module.exports = {
  DEFAULT_USER_ID,
  listCheckins,
  listWeekCheckins,
  createCheckin,
  getStats,
  toDateOnlyString,
  startOfWeek,
  endOfWeek,
};
