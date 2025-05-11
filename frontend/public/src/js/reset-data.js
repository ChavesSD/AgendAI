/*
/**
 * reset-data.js
 * Script para limpar todos os dados mockados do localStorage quando o sistema é iniciado
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Executando limpeza de dados mockados...');

    // Lista de dados que serão limpos do localStorage
    const dataKeys = [
        'agendai_clients',
        'agendai_appointments',
        'agendai_users',
        'agendai_professionals',
        'agendai_services',
        'agendai_plans',
        'agendai_companies',
        'agendai_reports'
    ];

    // Limpar as arrays globais
    window.clients = [];
    window.appointments = [];
    window.users = [];
    window.professionals = [];
    window.services = [];
    window.plans = [];
    window.companies = [];
    window.reportData = {};
    window.companyClients = [];

    // Limpar dados do localStorage
    dataKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`${key} removido do localStorage`);
        }
    });

    console.log('Limpeza de dados mockados concluída. Sistema iniciado sem dados.');
}); 