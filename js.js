document.addEventListener('DOMContentLoaded', () => {
    // 0. DICCIONARIO DE TRADUCCIÓN (Interfaz)
    const textosInterfaz = {
        es: {
            h1:"TABLA PERIÓDICA",
            h2:"Búsqueda Avanzada",
            h3:"Grupo General",
            Metales:"🪙Metales",
            Alcalinos:"Alcalinos",
            Alcalinoterreos:"Alcalinotérreos",
            Transicion:"Transición",
            Posttransicion:"Post-transición",
            Lantanidos:"Lantánidos",
            Actinidos:"Actínidos",
            Nometal:"🪵No Metales",
            Otrosnometales:"Otros No Metales",
            Halogenos:"Halógenos",
            Gasesnobles:"Gases Nobles",
            Metaloides:"💎Metaloide",
            BloqueElectronico:"Bloque Electrónico",
            EstadoFisico:"Estado Físico",
            Solido:"🧊Sólido",
            Liquido:"💧Líquido",
            Gas:"💨Gas",
            Origen:"Origen",
            Natural:"☘️Natural",
            Sintetico:"🧪Sintético",
            EstabilidadNuclear:"Estabilidad Nuclear",
            Estable:"Estable",
            Radiactivo:"Radiactivo",
            Inestable:"Inestable",
            LimpiarFiltros:"🧹Limpiar Filtros",
            Ptabla:"© 2026 Tabla Periódica Interactiva",
            Fuente:"v2.4.0 • Fuente: IUPAC 2026",
            Contacto:"Contacto: soportesayuxp@gmail.com",
            Educacion:"Educación",
            EducacionTXT:"Recurso pedagógico de química pura y aplicada.",
            Privacidad:"Privacidad",
            PrivasidadTXT:"App estática: no cookies, no tracking. 100% Privado.",
            TamañoCeldas:"Tamaño de Celdas"
        },
        en: {
            h1:"PERIODIC TABLE",
            h2:"Advanced Search",
            h3:"General Group",
            Metales:"🪙Metals",
            Alcalinos:"Alkali Metals",
            Alcalinoterreos:"Alkaline Earth Metals",
            Transicion:"Transition Metals",
            Posttransicion:"Post-Transition Metals",
            Lantanidos:"Lanthanides",
            Actinidos:"Actinides",
            Nometal:"🪵Nonmetals",
            Otrosnometales:"Other Nonmetals",
            Halogenos:"Halogens",
            Gasesnobles:"Noble Gases",
            Metaloides:"💎Metaloids",
            BloqueElectronico:"Electronic Block",
            EstadoFisico:"Physical State",
            Solido:"🧊Solid",
            Liquido:"💧Liquid",
            Gas:"💨Gas",
            Origen:"Origin",
            Natural:"☘️Natural",
            Sintetico:"🧪Synthetic",
            EstabilidadNuclear:"Nuclear Stability",
            Estable:"Stable",
            Radiactivo:"Radioactive",
            Inestable:"Unstable",
            LimpiarFiltros:"🧹Clear Filters",
            Ptabla:"© 2026 Interactive Periodic Table",
            Fuente:"v2.4.0 • Source: IUPAC 2026",
            Contacto:"Contact: soportesayuxp@gmail.com",
            Educacion:"Education",
            EducacionTXT:"Educational resource for pure and applied chemistry.",
            Privacidad:"Privacy",
            PrivasidadTXT:"Static app: no cookies, no tracking. 100% Private.",
            
            TamañoCeldas:"Cell size"
        }
    };

    // 1. SELECTORES
    const menuLateral = document.getElementById('menu-lateral');
    const btnMenu = document.getElementById('btn-menu');
    const btnSubNav = document.getElementById('btn-toggle-sub');
    const subNavContent = document.getElementById('sub-nav-content');
    const grid = document.getElementById('periodic-table-grid');
    
    // SELECTORES CONFIGURACIÓN
    const btnConfig = document.getElementById('btn-config');
    const modalConfig = document.getElementById('modal-config');
    const btnCerrarConfig = document.getElementById('btn-cerrar-config');
    const rangeTamano = document.getElementById('range-tamano');
    const valorTamano = document.getElementById('valor-tamano');
    const btnLimpiar = document.getElementById('ui-btn_limpiar');
    const selectIdioma = document.getElementById('select-idioma'); // Selector de idioma

    // SELECTORES MODAL INFORMACIÓN
    const modalElemento = document.getElementById('modal-elemento');
    const btnCerrarInfo = document.getElementById('btn-cerrar-info');
    
    // ESTADOS GLOBALES
    let idiomaActual = 'es'; // Estado del idioma (es / en)
    let filtrosBloquesActivos = [];
    let filtrosEstadosActivos = [];
    let filtrosOrigenesActivos = [];
    let filtrosTiposActivos = []; 
    let filtrosFamiliasActivos = []; 
    let filtrosEstabilidadActivos = []; 

    const overlay = document.createElement('div');
    overlay.id = 'overlay-menu';
    document.body.appendChild(overlay);

    const limpiarTexto = (texto) => 
        texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, " ").trim().toLowerCase() : "";

    // 1.5 FUNCIÓN PARA TRADUCIR LA INTERFAZ
    function traducirInterfaz() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const clave = el.getAttribute('data-i18n');
            if (textosInterfaz[idiomaActual][clave]) {
                el.textContent = textosInterfaz[idiomaActual][clave];
            }
        });
    }

    // 2. FUNCIÓN GENERAR CELDAS (ACTUALIZADA PARA TRADUCCIÓN)
    function generarCeldas() {
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 1; i <= 180; i++) {
            const celda = document.createElement('div');
            celda.id = `pos-${i}`;
            celda.className = 'celda-base';
            grid.appendChild(celda);
        }
        if (typeof elementos !== 'undefined' && Array.isArray(elementos)) {
            elementos.forEach(el => {
                const contenedor = document.getElementById(`pos-${el.posicion}`);
                if (contenedor) {
                    contenedor.classList.add('elemento-active');
                    
                    // Obtener nombre según idioma actual
                    const nombreTraducido = el.nombre[idiomaActual] || el.nombre.es;

                    contenedor.innerHTML = `
                        <span class="atomo-num">${el.numero_atomico}</span>
                        <span class="simbolo">${el.simbolo}</span>
                        <small>${nombreTraducido}</small>
                    `;
                    // EVENTO CLIC PARA MOSTRAR INFORMACIÓN
                    contenedor.onclick = () => mostrarInformacionElemento(el);
                }
            });
        }
        actualizarFiltrosVisuales();
    }

    // 3. FUNCIÓN MOSTRAR INFORMACIÓN (ACTUALIZADA PARA TRADUCCIÓN)
    function mostrarInformacionElemento(el) {
        if (!modalElemento) return;

        // Rellenar datos según idioma actual
        document.getElementById('info-nombre').textContent = el.nombre[idiomaActual] || el.nombre.es;
        document.getElementById('info-simbolo').textContent = el.simbolo;
        document.getElementById('info-numero').textContent = el.numero_atomico;
        document.getElementById('info-descripcion').textContent = el.descripcion[idiomaActual] || el.descripcion.es;
        
        // Rellenar tipo/clasificación
        const txtTipo = el.divisiones?.tipo_de_elemento?.[idiomaActual] || el.divisiones?.tipo_de_elemento?.es || "";
        document.getElementById('info-tipo').textContent = txtTipo.toUpperCase();

        // Rellenar estructura atómica
        document.getElementById('info-protones').textContent = el.estructura_atomica?.protones || 0;
        document.getElementById('info-neutrones').textContent = el.estructura_atomica?.neutrones || 0;
        document.getElementById('info-electrones').textContent = el.estructura_atomica?.electrones || 0;

        // Rellenar Usos
        const listaUsos = document.getElementById('info-usos');
        listaUsos.innerHTML = '';
        const usosTraducidos = el.usos?.[idiomaActual] || el.usos?.es || [];
        usosTraducidos.forEach(uso => {
            const li = document.createElement('li');
            li.textContent = uso;
            listaUsos.appendChild(li);
        });

        // Mostrar modal y overlay
        modalElemento.classList.remove('hidden');
        overlay.classList.add('active');
    }

    // 4. EVENTOS DE NAVEGACIÓN Y MENÚS
    btnMenu.onclick = () => { menuLateral.classList.add('active'); overlay.classList.add('active'); };
    
    overlay.onclick = () => {
        menuLateral.classList.remove('active');
        overlay.classList.remove('active');
        modalConfig.classList.add('hidden'); 
        if(modalElemento) modalElemento.classList.add('hidden');
    };

    if (btnCerrarInfo) {
        btnCerrarInfo.onclick = () => {
            modalElemento.classList.add('hidden');
            overlay.classList.remove('active');
        };
    }

    if (btnSubNav) {
        btnSubNav.onclick = () => {
            const estaActivo = subNavContent.classList.toggle('active');
            btnSubNav.textContent = estaActivo ? '(/\\)' : '(\\/)';
        };
    }

    // 5. EVENTO CAMBIO DE IDIOMA
    if (selectIdioma) {
        selectIdioma.onchange = (e) => {
            idiomaActual = e.target.value;
            generarCeldas();     // Re-genera la tabla
            traducirInterfaz();  // Traduce textos fijos
        };
    }

    document.querySelectorAll('.grupo-filtro h3').forEach(t => t.onclick = () => t.parentElement.classList.toggle('abierto'));

    document.querySelectorAll('.btn-desplegar-sub').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation(); 
            const padreBoton = btn.closest('.item-arbol-padre');
            const listaHija = padreBoton.nextElementSibling;
            if (listaHija && listaHija.classList.contains('sub-lista-arbol')) {
                const estaCerrado = listaHija.classList.toggle('hidden');
                btn.textContent = estaCerrado ? '(\\/)' : '(/\\)';
            }
        };
    });

    // 6. LÓGICA DE CONFIGURACIÓN ⚙️
    btnConfig.onclick = () => {
        modalConfig.classList.remove('hidden');
        overlay.classList.add('active'); 
    };

    btnCerrarConfig.onclick = () => {
        modalConfig.classList.add('hidden');
        overlay.classList.remove('active');
    };

    rangeTamano.oninput = (e) => {
        const px = e.target.value;
        valorTamano.textContent = `${px}px`;
        document.documentElement.style.setProperty('--cell-size', `${px}px`);
    };

    // 7. LÓGICA DE FILTROS INDIVIDUALES
    const configurarBotones = (selector, listaFiltros) => {
        document.querySelectorAll(selector).forEach(btn => {
            btn.onclick = () => {
                const valor = limpiarTexto(btn.getAttribute('data-valor'));
                const index = listaFiltros.indexOf(valor);
                if (index > -1) {
                    listaFiltros.splice(index, 1);
                    btn.classList.remove('btn-filtro-activo');
                } else {
                    listaFiltros.push(valor);
                    btn.classList.add('btn-filtro-activo');
                }
                actualizarFiltrosVisuales();
            };
        });
    };

    configurarBotones('[data-tipo="bloque"]', filtrosBloquesActivos);
    configurarBotones('[data-tipo="estado"]', filtrosEstadosActivos);
    configurarBotones('[data-tipo="origen"]', filtrosOrigenesActivos);
    configurarBotones('[data-tipo="general"]', filtrosTiposActivos);
    configurarBotones('[data-tipo="familia"]', filtrosFamiliasActivos);
    configurarBotones('[data-tipo="estabilidad"]', filtrosEstabilidadActivos);

    // 8. LÓGICA DE BOTONES MAESTROS (SUB-BARRA)
    const configurarBotonMaestro = (idBoton, selectorHijos, listaFiltros) => {
        const btnMaestro = document.getElementById(idBoton);
        if (!btnMaestro) return;

        btnMaestro.onclick = () => {
            const botonesHijos = document.querySelectorAll(selectorHijos);
            const todosActivos = Array.from(botonesHijos).every(btn => 
                listaFiltros.includes(limpiarTexto(btn.getAttribute('data-valor')))
            );

            botonesHijos.forEach(btn => {
                const valor = limpiarTexto(btn.getAttribute('data-valor'));
                const index = listaFiltros.indexOf(valor);

                if (todosActivos) {
                    if (index > -1) {
                        listaFiltros.splice(index, 1);
                        btn.classList.remove('btn-filtro-activo');
                    }
                    btnMaestro.classList.remove('btn-filtro-activo');
                } else {
                    if (index === -1) {
                        listaFiltros.push(valor);
                        btn.classList.add('btn-filtro-activo');
                    }
                    btnMaestro.classList.add('btn-filtro-activo');
                }
            });
            actualizarFiltrosVisuales();
        };
    };

    configurarBotonMaestro('ui-nav-grupo', '[data-tipo="general"]', filtrosTiposActivos);
    configurarBotonMaestro('ui-nav-bloque', '[data-tipo="bloque"]', filtrosBloquesActivos);
    configurarBotonMaestro('ui-nav-estado', '[data-tipo="estado"]', filtrosEstadosActivos);
    configurarBotonMaestro('ui-nav-origen', '[data-tipo="origen"]', filtrosOrigenesActivos);
    configurarBotonMaestro('ui-nav-estabilidad', '[data-tipo="estabilidad"]', filtrosEstabilidadActivos);

    // Botón Limpiar
    if (btnLimpiar) {
        btnLimpiar.onclick = () => {
            filtrosBloquesActivos.length = 0;
            filtrosEstadosActivos.length = 0;
            filtrosOrigenesActivos.length = 0;
            filtrosTiposActivos.length = 0;
            filtrosFamiliasActivos.length = 0;
            filtrosEstabilidadActivos.length = 0;
            document.querySelectorAll('.btn-filtro-activo').forEach(b => b.classList.remove('btn-filtro-activo'));
            actualizarFiltrosVisuales();
        };
    }

    function actualizarFiltrosVisuales() {
        if (typeof elementos === 'undefined') return;

        const iconosEstado = { "solido": "🧊", "liquido": "💧", "gas": "💨" };
        const iconosOrigen = { "natural": "☘️", "sintetico": "🧪" };
        const iconosTipo = { "metal": "🪙", "no metal": "🪵", "metaloide": "💎" };

        elementos.forEach(el => {
            const contenedor = document.getElementById(`pos-${el.posicion}`);
            if (!contenedor) return;

            // 1. Limpieza
            contenedor.querySelectorAll('.bloque-tag, .estado-icon-tag, .origen-icon-tag, .tipo-icon-tag').forEach(tag => tag.remove());
            contenedor.classList.remove(
                'bg-alcalinos', 'bg-alcalinoterreos', 'bg-transicion', 
                'bg-post-transicion', 'bg-lantanidos', 'bg-actinidos', 
                'bg-otros-no-metales', 'bg-halogenos', 'bg-nobles',
                'glow-estable', 'glow-radiactivo', 'glow-inestable'
            );

            // 2. Datos (Usamos siempre la clave .es para los filtros internos de lógica)
            const bloqueEl = el.divisiones?.bloque_electrico || "";
            const estadoEl = el.divisiones?.estado?.es ? limpiarTexto(el.divisiones.estado.es) : "";
            const origenEl = el.divisiones?.origen?.es ? limpiarTexto(el.divisiones.origen.es) : "";
            const tipoEl = el.divisiones?.tipo_de_elemento?.es ? limpiarTexto(el.divisiones.tipo_de_elemento.es) : "";
            const clasificacionEl = el.divisiones?.clasificacion ? limpiarTexto(el.divisiones.clasificacion) : "";
            const estabilidadEl = (el.divisiones?.estabilidad_nuclear?.es) ? limpiarTexto(el.divisiones.estabilidad_nuclear.es) : "";

            // 3. Iconos
            if (filtrosBloquesActivos.includes(bloqueEl)) {
                const span = document.createElement('span'); span.className = 'bloque-tag'; span.textContent = bloqueEl; contenedor.appendChild(span);
            }
            if (filtrosEstadosActivos.includes(estadoEl)) {
                const spanE = document.createElement('span'); spanE.className = 'estado-icon-tag'; spanE.textContent = iconosEstado[estadoEl]; contenedor.appendChild(spanE);
            }
            if (filtrosOrigenesActivos.includes(origenEl)) {
                const spanO = document.createElement('span'); spanO.className = 'origen-icon-tag'; spanO.textContent = iconosOrigen[origenEl];
                if (filtrosEstadosActivos.includes(estadoEl)) spanO.style.right = "30%";
                contenedor.appendChild(spanO);
            }
            if (filtrosTiposActivos.includes(tipoEl)) {
                const spanT = document.createElement('span'); spanT.className = 'tipo-icon-tag'; spanT.textContent = iconosTipo[tipoEl]; contenedor.appendChild(spanT);
            }

            // 4. Fondos
            if (filtrosFamiliasActivos.includes(clasificacionEl)) {
                let claseFinal = clasificacionEl.replace(/\s+/g, '-');
                if (claseFinal === "gases-nobles") claseFinal = "nobles";
                contenedor.classList.add(`bg-${claseFinal}`);
            }

            // 5. Glow Estabilidad
            const activoGlow = estabilidadEl && filtrosEstabilidadActivos.includes(estabilidadEl);
            if (activoGlow) {
                contenedor.classList.add(`glow-${estabilidadEl}`);
            }

            // 6. Control de Bordes
            const activoOtros = filtrosBloquesActivos.includes(bloqueEl) || 
                               filtrosEstadosActivos.includes(estadoEl) || 
                               filtrosOrigenesActivos.includes(origenEl) || 
                               filtrosTiposActivos.includes(tipoEl) ||
                               filtrosFamiliasActivos.includes(clasificacionEl);

            if (activoGlow) {
                contenedor.style.borderColor = ""; 
                contenedor.style.boxShadow = "";
            } else if (activoOtros) {
                contenedor.style.borderColor = 'var(--verde-hoja)';
                contenedor.style.boxShadow = 'none';
            } else {
                contenedor.style.borderColor = 'var(--verde-bosque)';
                contenedor.style.boxShadow = 'none';
            }
        });
    }

    generarCeldas();
    traducirInterfaz(); // Llamada inicial para aplicar el idioma por defecto
});
