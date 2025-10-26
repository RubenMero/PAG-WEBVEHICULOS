document.addEventListener('DOMContentLoaded', () => {
    const user = window.CURRENT_USER;
    const isGuardia = user.role === 'GUARDIA';
    const tableBody = document.getElementById('tableConsulta');
    const exportButtons = document.getElementById('exportButtons');

    // RBAC: Ocultar botones de exportación si es Guardia
    if (isGuardia) {
        if (exportButtons) exportButtons.style.display = 'none';
    }

    // Función principal para cargar y filtrar
    window.buscarIngresos = function() {
        const searchPlaca = document.getElementById('searchPlaca').value.trim().toUpperCase();
        const searchFecha = document.getElementById('searchFecha').value;
        const allIngresos = window.getStoredData('ingresos');
        
        let filteredIngresos = allIngresos;

        // 1. RBAC: Filtrado por 7 días si es GUARDIA
        if (isGuardia) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            // Si el usuario no aplica filtro de fecha, se aplica el de los 7 días
            filteredIngresos = filteredIngresos.filter(i => 
                new Date(i.ingresoTimestamp) >= sevenDaysAgo
            );
            
            if (searchFecha) {
                 // Si Guardia busca por una fecha específica, solo busca en esa fecha (dentro de los 7 días)
                 filteredIngresos = filteredIngresos.filter(i => i.fechaIngreso === searchFecha);
            }
        } else if (searchFecha) {
            // Admin/Supervisor: Filtrar por fecha exacta si se proporciona
            filteredIngresos = filteredIngresos.filter(i => i.fechaIngreso === searchFecha);
        }

        // 2. Filtrado por Placa (aplica a todos los roles)
        if (searchPlaca) {
            filteredIngresos = filteredIngresos.filter(i => i.placa.includes(searchPlaca));
        }

        // 3. Renderizar resultados
        tableBody.innerHTML = '';
        if (filteredIngresos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No se encontraron registros bajo los criterios de búsqueda.</td></tr>';
            window.showNotification('No se encontraron registros.', 'warning');
            return;
        }

        filteredIngresos.forEach(i => {
            const row = tableBody.insertRow();
            const estadoBadge = i.estado === 'ACTIVO' ? 
                                `<span class="badge badge-success">Activo</span>` : 
                                `<span class="badge badge-danger">Cerrado</span>`;
            
            // Acciones solo disponibles para Admin/Supervisor para corregir
            const accionesHTML = (user.role !== 'GUARDIA') ? 
                `<button class="btn btn-warning btn-sm" onclick="corregirRegistro(${i.id})">Editar</button>` : 'N/A';
            
            row.innerHTML = `
                <td>${i.id}</td>
                <td>${i.placa}</td>
                <td>${i.tipoVehiculo}</td>
                <td>${i.idConductor}</td>
                <td>${window.formatDate(new Date(i.ingresoTimestamp))}</td>
                <td>${estadoBadge}</td>
                <td>${accionesHTML}</td>
            `;
        });
        
        if (allIngresos.length > 0) {
             window.showNotification(`Consulta realizada. Se encontraron ${filteredIngresos.length} registros.`, 'success');
        }
    };
    
    // Función para limpiar filtros y recargar todos los datos (según permisos)
    window.limpiarBusqueda = function() {
        document.getElementById('searchPlaca').value = '';
        document.getElementById('searchFecha').value = '';
        window.buscarIngresos();
    };

    // Funciones de Exportación (Simulación)
    window.exportarExcel = function() {
        if (isGuardia) return; // Doble check RBAC
        window.showNotification('Generando y descargando Excel...', 'success');
        // Lógica real de exportación (ej. usando librerías como XLSX.js)
    };

    window.exportarPDF = function() {
        if (isGuardia) return; // Doble check RBAC
        window.showNotification('Generando y descargando PDF...', 'success');
        // Lógica real de exportación (ej. usando jspdf)
    };
    
    // Función de corrección (solo Admin/Supervisor)
    window.corregirRegistro = function(id) {
         if (user.role === 'GUARDIA') return; // Doble check RBAC
         window.showNotification(`Simulando edición del registro ID: ${id}.`, 'warning');
         // Aquí iría la lógica para cargar el formulario de corrección.
    };

    window.buscarIngresos(); // Carga inicial
});