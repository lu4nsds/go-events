import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // ALTERE AQUI OS DADOS DO SEU ADMIN
    const adminData = {
      name: "Administrador",
      email: "admin@go-events.com", // ← ALTERE PARA SEU EMAIL
      password: "admin123", // ← ALTERE PARA SUA SENHA
      isAdmin: true,
    };

    console.log("🔐 Criando usuário administrador...");
    console.log("📧 Email:", adminData.email);

    // Verificar se já existe um usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      if (existingUser.isAdmin) {
        console.log("✅ Usuário admin já existe!");
        console.log("🔑 Use a senha:", adminData.password);
        return;
      } else {
        // Se existe mas não é admin, atualizar para admin
        await prisma.user.update({
          where: { email: adminData.email },
          data: { isAdmin: true },
        });
        console.log("✅ Usuário existente atualizado para admin!");
        console.log("🔑 Use a senha cadastrada anteriormente");
        return;
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    console.log("✅ Usuário administrador criado com sucesso!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Senha:", adminData.password);
    console.log("👑 Admin:", admin.isAdmin);
    console.log("\n🌐 Faça login como admin em:");
    console.log("   • Local: http://localhost:3000/login");
    console.log(
      "   • Produção: https://go-events-oszh313zt-lu4nsds-projects.vercel.app/login"
    );
    console.log("\n📍 Após login, acesse: /admin/events");
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);

    if (error.code === "P2002") {
      console.log("💡 Dica: Este email já está em uso. Tente outro email.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

console.log("🚀 Iniciando criação do usuário admin...\n");
createAdmin();
