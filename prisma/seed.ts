import { PrismaClient, Role, Track, AssetType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@businesscontrol.com' },
    update: {},
    create: {
      email: 'admin@businesscontrol.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      preferredLocale: 'he',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'David Cohen',
      passwordHash: studentPassword,
      role: Role.STUDENT,
      preferredLocale: 'he',
    },
  })
  console.log('✅ Created student user:', student.email)

  // Create another student
  const student2Password = await bcrypt.hash('student123', 12)
  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      email: 'student2@example.com',
      name: 'Sarah Levy',
      passwordHash: student2Password,
      role: Role.STUDENT,
      preferredLocale: 'en',
    },
  })
  console.log('✅ Created student user:', student2.email)

  // Create cohort
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7) // Started a week ago

  const cohort = await prisma.cohort.upsert({
    where: { enrollmentCode: 'COHORT2024' },
    update: {},
    create: {
      name: 'מחזור ינואר 2024',
      startDate,
      isActive: true,
      enrollmentCode: 'COHORT2024',
      capacity: 30,
    },
  })
  console.log('✅ Created cohort:', cohort.name)

  // Create weeks with content
  const weeksData = [
    {
      weekNumber: 1,
      title: 'מיפוי המצב הנוכחי',
      description: `
        <h2>ברוכים הבאים לשבוע הראשון!</h2>
        <p>בשבוע זה נתמקד במיפוי המצב הנוכחי של העסק שלכם. נבין איפה אתם עומדים ומה המדדים החשובים ביותר לעסק שלכם.</p>
        <h3>מה נלמד השבוע:</h3>
        <ul>
          <li>הגדרת יעדי העסק לטווח הקצר והארוך</li>
          <li>זיהוי המדדים החשובים ביותר (KPIs)</li>
          <li>מיפוי המצב הנוכחי של כל מדד</li>
          <li>הגדרת נקודת ההתחלה למעקב</li>
        </ul>
        <p>עברו על החומרים, מלאו את רשימת המשימות, והגישו את התרגיל השבועי.</p>
      `,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      deadline: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      checklist: [
        { title: 'צפיתי בסרטון השבועי', isRequired: true, order: 1 },
        { title: 'הגדרתי 3-5 יעדים לעסק', isRequired: true, order: 2 },
        { title: 'זיהיתי את המדדים החשובים', isRequired: true, order: 3 },
        { title: 'מילאתי את תבנית מיפוי המצב', isRequired: true, order: 4 },
        { title: 'קראתי את החומר הנוסף', isRequired: false, order: 5 },
        { title: 'שיתפתי בקבוצה (אופציונלי)', isRequired: false, order: 6 },
      ],
      assets: [
        { title: 'תבנית מיפוי מצב עסקי', fileUrl: '/templates/mapping-template.xlsx', type: AssetType.TEMPLATE },
        { title: 'רשימת KPIs נפוצים', fileUrl: '/templates/kpi-list.pdf', type: AssetType.TEMPLATE },
        { title: 'דוגמה למילוי התבנית', fileUrl: '/templates/example-mapping.pdf', type: AssetType.OTHER },
      ],
    },
    {
      weekNumber: 2,
      title: 'בניית מערכת המעקב',
      description: `
        <h2>שבוע 2: בניית מערכת המעקב</h2>
        <p>השבוע נבנה את מערכת המעקב שתלווה אתכם לאורך זמן. נבחר כלים מתאימים וניצור דשבורד פשוט ויעיל.</p>
        <h3>מה נלמד השבוע:</h3>
        <ul>
          <li>בחירת כלי המעקב המתאים לכם</li>
          <li>הקמת דשבורד אישי</li>
          <li>הגדרת תהליכי איסוף נתונים</li>
          <li>אוטומציות פשוטות לחיסכון בזמן</li>
        </ul>
      `,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      deadline: new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      checklist: [
        { title: 'צפיתי בסרטון השבועי', isRequired: true, order: 1 },
        { title: 'בחרתי כלי מעקב (Google Sheets/Excel/אחר)', isRequired: true, order: 2 },
        { title: 'בניתי דשבורד ראשוני', isRequired: true, order: 3 },
        { title: 'הזנתי נתונים ראשוניים', isRequired: true, order: 4 },
        { title: 'הגדרתי תזכורת שבועית', isRequired: false, order: 5 },
      ],
      assets: [
        { title: 'תבנית דשבורד Google Sheets', fileUrl: '/templates/dashboard-template.xlsx', type: AssetType.TEMPLATE },
        { title: 'מדריך שימוש בתבנית', fileUrl: '/templates/dashboard-guide.pdf', type: AssetType.OTHER },
      ],
    },
    {
      weekNumber: 3,
      title: 'ניתוח והבנת הנתונים',
      description: `
        <h2>שבוע 3: ניתוח והבנת הנתונים</h2>
        <p>עכשיו שיש לנו מערכת מעקב, נלמד כיצד לקרוא את הנתונים, לזהות מגמות ולמצוא הזדמנויות ובעיות.</p>
        <h3>מה נלמד השבוע:</h3>
        <ul>
          <li>איך לקרוא נתונים נכון</li>
          <li>זיהוי מגמות וdpatterns</li>
          <li>מציאת הזדמנויות לצמיחה</li>
          <li>זיהוי בעיות לפני שהן מתפתחות</li>
        </ul>
      `,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      deadline: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000),
      checklist: [
        { title: 'צפיתי בסרטון השבועי', isRequired: true, order: 1 },
        { title: 'ניתחתי את הנתונים שאספתי', isRequired: true, order: 2 },
        { title: 'זיהיתי לפחות מגמה אחת', isRequired: true, order: 3 },
        { title: 'רשמתי 3 תובנות מהנתונים', isRequired: true, order: 4 },
      ],
      assets: [
        { title: 'מדריך לניתוח נתונים', fileUrl: '/templates/analysis-guide.pdf', type: AssetType.TEMPLATE },
        { title: 'דוח לדוגמה', fileUrl: '/templates/sample-report.pdf', type: AssetType.REPORT },
      ],
    },
    {
      weekNumber: 4,
      title: 'פעולה ותכנון להמשך',
      description: `
        <h2>שבוע 4: פעולה ותכנון להמשך</h2>
        <p>השבוע האחרון! נלמד כיצד להפוך את התובנות לפעולות, לבנות תוכנית חודשית ולהגדיר את שגרת התחזוקה השוטפת.</p>
        <h3>מה נלמד השבוע:</h3>
        <ul>
          <li>קבלת החלטות מבוססות נתונים</li>
          <li>בניית תוכנית פעולה חודשית</li>
          <li>הגדרת יעדים חודשיים</li>
          <li>תחזוקה שוטפת של המערכת</li>
        </ul>
      `,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      deadline: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      checklist: [
        { title: 'צפיתי בסרטון השבועי', isRequired: true, order: 1 },
        { title: 'בניתי תוכנית פעולה לחודש הקרוב', isRequired: true, order: 2 },
        { title: 'הגדרתי 3 יעדים חודשיים', isRequired: true, order: 3 },
        { title: 'קבעתי זמן שבועי קבוע למעקב', isRequired: true, order: 4 },
        { title: 'מילאתי את משוב הקורס', isRequired: false, order: 5 },
      ],
      assets: [
        { title: 'תבנית תוכנית פעולה חודשית', fileUrl: '/templates/monthly-plan.xlsx', type: AssetType.TEMPLATE },
        { title: 'צ\'קליסט תחזוקה שבועית', fileUrl: '/templates/maintenance-checklist.pdf', type: AssetType.TEMPLATE },
      ],
    },
  ]

  // Create weeks
  for (const weekData of weeksData) {
    const { checklist, assets, ...weekInfo } = weekData

    // Check if week already exists
    const existingWeek = await prisma.week.findFirst({
      where: { cohortId: cohort.id, weekNumber: weekInfo.weekNumber }
    })

    if (existingWeek) {
      console.log(`⏭️ Week ${weekInfo.weekNumber} already exists, skipping...`)
      continue
    }

    const week = await prisma.week.create({
      data: {
        ...weekInfo,
        cohortId: cohort.id,
        checklist: {
          create: checklist,
        },
        assets: {
          create: assets,
        },
      },
    })
    console.log(`✅ Created week ${week.weekNumber}: ${week.title}`)
  }

  // Create enrollment for student
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: { userId: student.id, cohortId: cohort.id }
  })

  if (!existingEnrollment) {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        cohortId: cohort.id,
        track: Track.GROUP,
      },
    })
    console.log('✅ Created enrollment for student')

    // Create some checklist progress
    const weeks = await prisma.week.findMany({
      where: { cohortId: cohort.id },
      include: { checklist: true },
    })

    // Complete week 1 checklist
    const week1 = weeks.find(w => w.weekNumber === 1)
    if (week1) {
      for (const item of week1.checklist) {
        await prisma.checklistProgress.create({
          data: {
            enrollmentId: enrollment.id,
            checklistItemId: item.id,
            isDone: true,
          },
        })
      }

      // Create submission for week 1
      await prisma.submission.create({
        data: {
          enrollmentId: enrollment.id,
          weekId: week1.id,
          status: 'COMPLETED',
          textAnswer: 'הגדרתי את היעדים העיקריים של העסק שלי: הגדלת מחזור המכירות ב-20%, שיפור שימור לקוחות, והגברת הנוכחות הדיגיטלית.',
          submittedAt: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
        },
      })
      console.log('✅ Created submission for week 1')
    }
  }

  // Create enrollment for student2
  const existingEnrollment2 = await prisma.enrollment.findFirst({
    where: { userId: student2.id, cohortId: cohort.id }
  })

  if (!existingEnrollment2) {
    await prisma.enrollment.create({
      data: {
        userId: student2.id,
        cohortId: cohort.id,
        track: Track.PREMIUM,
      },
    })
    console.log('✅ Created enrollment for student2')
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
