// ===============================================
// GENEALOGY SYSTEM JAVASCRIPT
// ===============================================

class GenealogyManager {
    constructor() {
        this.goats = JSON.parse(localStorage.getItem('farmGoats') || '[]');
        this.breedingRecords = JSON.parse(localStorage.getItem('breedingRecords') || '[]');
        this.selectedGoat = null;
        this.treeData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSampleData();
        this.loadInitialView();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Search functionality
        document.getElementById('genealogy-search')?.addEventListener('input', (e) => {
            this.searchGoats(e.target.value);
        });

        // Filters
        document.getElementById('generation-filter')?.addEventListener('change', (e) => {
            this.filterByGeneration(e.target.value);
        });

        document.getElementById('breeding-status-filter')?.addEventListener('change', (e) => {
            this.filterByBreedingStatus(e.target.value);
        });

        // Pedigree search
        document.getElementById('pedigree-search')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generatePedigree();
            }
        });
    }

    generateSampleData() {
        // Generate sample goats if none exist
        if (this.goats.length === 0) {
            this.goats = [
                {
                    id: 'G001',
                    name: 'Thunder',
                    breed: 'Boer',
                    gender: 'Male',
                    dob: '2020-03-15',
                    parents: { sire: null, dam: null },
                    generation: 1,
                    breedingStatus: 'active',
                    offspring: ['G003', 'G004', 'G005']
                },
                {
                    id: 'G002',
                    name: 'Luna',
                    breed: 'Boer',
                    gender: 'Female',
                    dob: '2020-05-22',
                    parents: { sire: null, dam: null },
                    generation: 1,
                    breedingStatus: 'active',
                    offspring: ['G003', 'G006']
                },
                {
                    id: 'G003',
                    name: 'Star',
                    breed: 'Boer',
                    gender: 'Female',
                    dob: '2022-04-10',
                    parents: { sire: 'G001', dam: 'G002' },
                    generation: 2,
                    breedingStatus: 'young',
                    offspring: []
                },
                {
                    id: 'G004',
                    name: 'Rocky',
                    breed: 'Boer',
                    gender: 'Male',
                    dob: '2022-06-18',
                    parents: { sire: 'G001', dam: 'G007' },
                    generation: 2,
                    breedingStatus: 'young',
                    offspring: []
                },
                {
                    id: 'G005',
                    name: 'Bella',
                    breed: 'Boer',
                    gender: 'Female',
                    dob: '2021-08-30',
                    parents: { sire: 'G001', dam: 'G008' },
                    generation: 2,
                    breedingStatus: 'active',
                    offspring: ['G009']
                },
                {
                    id: 'G006',
                    name: 'Duke',
                    breed: 'Boer',
                    gender: 'Male',
                    dob: '2021-11-12',
                    parents: { sire: 'G010', dam: 'G002' },
                    generation: 2,
                    breedingStatus: 'active',
                    offspring: ['G011']
                },
                {
                    id: 'G007',
                    name: 'Pearl',
                    breed: 'Boer',
                    gender: 'Female',
                    dob: '2019-12-05',
                    parents: { sire: null, dam: null },
                    generation: 1,
                    breedingStatus: 'retired',
                    offspring: ['G004']
                },
                {
                    id: 'G008',
                    name: 'Ruby',
                    breed: 'Boer',
                    gender: 'Female',
                    dob: '2020-01-18',
                    parents: { sire: null, dam: null },
                    generation: 1,
                    breedingStatus: 'active',
                    offspring: ['G005']
                },
                {
                    id: 'G009',
                    name: 'Storm',
                    breed: 'Boer',
                    gender: 'Male',
                    dob: '2023-05-15',
                    parents: { sire: 'G006', dam: 'G005' },
                    generation: 3,
                    breedingStatus: 'young',
                    offspring: []
                },
                {
                    id: 'G010',
                    name: 'Zeus',
                    breed: 'Boer',
                    gender: 'Male',
                    dob: '2019-07-10',
                    parents: { sire: null, dam: null },
                    generation: 1,
                    breedingStatus: 'active',
                    offspring: ['G006']
                },
                {
                    id: 'G011',
                    name: 'Angel',
                    breed: 'Boer',
                    gender: 'Female',
                    dob: '2023-09-22',
                    parents: { sire: 'G006', dam: 'G012' },
                    generation: 3,
                    breedingStatus: 'young',
                    offspring: []
                },
                {
                    id: 'G012',
                    name: 'Grace',
                    breed: 'Boer',
                    gender: 'Female',
                    dob: '2020-10-08',
                    parents: { sire: null, dam: null },
                    generation: 1,
                    breedingStatus: 'active',
                    offspring: ['G011']
                }
            ];
            localStorage.setItem('farmGoats', JSON.stringify(this.goats));
        }
    }

    loadInitialView() {
        this.generateFamilyTree();
        this.updateGeneticStats();
        this.generateBreedingRecommendations();
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Load content for specific tabs
        switch(tabName) {
            case 'tree-view':
                this.generateFamilyTree();
                break;
            case 'pedigree-view':
                // Pedigree is generated on demand
                break;
            case 'breeding-matrix':
                this.generateBreedingMatrix();
                break;
            case 'genetic-stats':
                this.updateGeneticStats();
                this.generateBreedingRecommendations();
                break;
        }
    }

    generateFamilyTree() {
        const treeContainer = document.getElementById('family-tree');
        if (!treeContainer) return;

        treeContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Generating family tree...</div>';

        setTimeout(() => {
            const generations = this.organizeByGenerations();
            this.renderFamilyTree(generations, treeContainer);
        }, 500);
    }

    organizeByGenerations() {
        const generations = {};
        
        this.goats.forEach(goat => {
            const gen = goat.generation || 1;
            if (!generations[gen]) {
                generations[gen] = [];
            }
            generations[gen].push(goat);
        });

        return generations;
    }

    renderFamilyTree(generations, container) {
        container.innerHTML = '';
        
        if (Object.keys(generations).length === 0) {
            container.innerHTML = `
                <div class="empty-tree">
                    <i class="fas fa-sitemap"></i>
                    <h3>No Goats Found</h3>
                    <p>Add goats to see the family tree</p>
                </div>
            `;
            return;
        }

        const treeWrapper = document.createElement('div');
        treeWrapper.className = 'tree-wrapper';
        treeWrapper.style.position = 'relative';
        treeWrapper.style.minHeight = '600px';
        treeWrapper.style.width = '100%';

        let yOffset = 50;
        const generationHeight = 200;

        Object.keys(generations).sort((a, b) => a - b).forEach(gen => {
            const goats = generations[gen];
            const xSpacing = Math.max(250, container.offsetWidth / (goats.length + 1));
            
            goats.forEach((goat, index) => {
                const xPosition = (index + 1) * xSpacing - 100;
                const yPosition = yOffset + (gen - 1) * generationHeight;

                const nodeElement = this.createTreeNode(goat, xPosition, yPosition);
                treeWrapper.appendChild(nodeElement);

                // Draw connections to parents
                this.drawParentConnections(goat, xPosition, yPosition, treeWrapper, generations);
            });
        });

        container.appendChild(treeWrapper);
    }

    createTreeNode(goat, x, y) {
        const node = document.createElement('div');
        node.className = `tree-node ${goat.gender.toLowerCase()}`;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;

        const age = this.calculateAge(goat.dob);
        const statusIcon = this.getStatusIcon(goat.breedingStatus);

        node.innerHTML = `
            <div class="node-id">ID: ${goat.id}</div>
            <h4>${goat.name} ${statusIcon}</h4>
            <div class="node-breed">${goat.breed}</div>
            <div class="node-age">${age}</div>
            <div class="node-gen">Gen ${goat.generation}</div>
        `;

        node.addEventListener('click', () => {
            this.showGoatDetails(goat);
        });

        return node;
    }

    drawParentConnections(goat, x, y, container, generations) {
        if (!goat.parents || (!goat.parents.sire && !goat.parents.dam)) return;

        const parentGeneration = goat.generation - 1;
        if (!generations[parentGeneration]) return;

        const parents = generations[parentGeneration];
        
        ['sire', 'dam'].forEach(parentType => {
            const parentId = goat.parents[parentType];
            if (!parentId) return;

            const parent = parents.find(p => p.id === parentId);
            if (!parent) return;

            const parentIndex = parents.indexOf(parent);
            const parentXSpacing = Math.max(250, container.offsetWidth / (parents.length + 1));
            const parentX = (parentIndex + 1) * parentXSpacing - 100;
            const parentY = y - 200;

            // Draw line from parent to child
            this.drawConnection(parentX + 90, parentY + 120, x + 90, y, container);
        });
    }

    drawConnection(x1, y1, x2, y2, container) {
        // Calculate line properties
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        const line = document.createElement('div');
        line.className = 'tree-connection';
        line.style.position = 'absolute';
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.width = `${length}px`;
        line.style.height = '2px';
        line.style.background = 'var(--logo-green)';
        line.style.transformOrigin = '0 0';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.zIndex = '1';

        container.appendChild(line);
    }

    generatePedigree() {
        const searchTerm = document.getElementById('pedigree-search')?.value;
        if (!searchTerm) return;

        const goat = this.findGoat(searchTerm);
        if (!goat) {
            alert('Goat not found');
            return;
        }

        const pedigreeChart = document.getElementById('pedigree-chart');
        if (!pedigreeChart) return;

        pedigreeChart.innerHTML = this.buildPedigreeHTML(goat, 3); // 3 generations
    }

    buildPedigreeHTML(goat, generations) {
        if (generations <= 0 || !goat) return '';

        const parents = this.getParents(goat);
        const age = this.calculateAge(goat.dob);

        let html = `
            <div class="pedigree-generation">
                <div class="pedigree-individual ${goat.gender.toLowerCase()}">
                    <h4>${goat.name}</h4>
                    <div class="pedigree-details">
                        <div>ID: ${goat.id}</div>
                        <div>Breed: ${goat.breed}</div>
                        <div>Age: ${age}</div>
                        <div>Status: ${goat.breedingStatus}</div>
                    </div>
                </div>
        `;

        if (generations > 1 && (parents.sire || parents.dam)) {
            html += '<div class="pedigree-parents">';
            if (parents.sire) {
                html += this.buildPedigreeHTML(parents.sire, generations - 1);
            }
            if (parents.dam) {
                html += this.buildPedigreeHTML(parents.dam, generations - 1);
            }
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    generateBreedingMatrix() {
        const matrixContainer = document.getElementById('breeding-matrix-table');
        if (!matrixContainer) return;

        const activeBreedersMales = this.goats.filter(g => g.gender === 'Male' && g.breedingStatus === 'active');
        const activeBreeders = this.goats.filter(g => g.gender === 'Female' && g.breedingStatus === 'active');

        let html = `
            <table class="matrix-table">
                <thead>
                    <tr>
                        <th>Female \\ Male</th>
                        ${activeBreedersMales.map(male => `<th>${male.name}<br><small>${male.id}</small></th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        activeBreeders.forEach(female => {
            html += `<tr><td><strong>${female.name}</strong><br><small>${female.id}</small></td>`;
            activeBreedersMales.forEach(male => {
                const compatibility = this.calculateBreedingCompatibility(female, male);
                html += `<td><span class="compatibility-score ${compatibility.class}">${compatibility.score}%</span></td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        matrixContainer.innerHTML = html;
    }

    calculateBreedingCompatibility(female, male) {
        let score = 100;
        let reasons = [];

        // Check for inbreeding
        if (this.areRelated(female, male)) {
            score -= 50;
            reasons.push('Related');
        }

        // Check age compatibility
        const femaleAge = this.calculateAgeInMonths(female.dob);
        const maleAge = this.calculateAgeInMonths(male.dob);
        
        if (femaleAge < 8 || maleAge < 8) {
            score -= 30;
            reasons.push('Too young');
        }

        // Check genetic diversity
        if (female.breed !== male.breed) {
            score += 10;
            reasons.push('Genetic diversity');
        }

        // Determine class
        let compatibilityClass;
        if (score >= 90) compatibilityClass = 'excellent';
        else if (score >= 70) compatibilityClass = 'good';
        else if (score >= 50) compatibilityClass = 'poor';
        else compatibilityClass = 'incompatible';

        return { score: Math.max(0, score), class: compatibilityClass, reasons };
    }

    areRelated(goat1, goat2, maxGenerations = 3) {
        // Simple relationship check - can be enhanced for more complex genealogy
        const ancestors1 = this.getAncestors(goat1, maxGenerations);
        const ancestors2 = this.getAncestors(goat2, maxGenerations);
        
        return ancestors1.some(ancestor => ancestors2.includes(ancestor));
    }

    getAncestors(goat, generations) {
        if (generations <= 0 || !goat.parents) return [];
        
        const ancestors = [];
        const parents = this.getParents(goat);
        
        if (parents.sire) {
            ancestors.push(parents.sire.id);
            ancestors.push(...this.getAncestors(parents.sire, generations - 1));
        }
        
        if (parents.dam) {
            ancestors.push(parents.dam.id);
            ancestors.push(...this.getAncestors(parents.dam, generations - 1));
        }
        
        return [...new Set(ancestors)];
    }

    updateGeneticStats() {
        const stats = this.calculateGeneticStats();
        
        document.getElementById('genetic-diversity').textContent = `${stats.geneticDiversity}%`;
        document.getElementById('inbreeding-coeff').textContent = stats.inbreedingCoeff.toFixed(3);
        document.getElementById('avg-generation').textContent = stats.avgGeneration.toFixed(1);
        document.getElementById('breeding-lines').textContent = stats.breedingLines;
    }

    calculateGeneticStats() {
        const totalGoats = this.goats.length;
        const breeds = [...new Set(this.goats.map(g => g.breed))];
        const generations = this.goats.map(g => g.generation || 1);
        
        // Calculate genetic diversity (simplified)
        const geneticDiversity = Math.min(100, (breeds.length * 20) + (totalGoats > 10 ? 30 : totalGoats * 3));
        
        // Calculate average inbreeding coefficient (simplified)
        let inbreedingSum = 0;
        this.goats.forEach(goat => {
            const ancestors = this.getAncestors(goat, 3);
            const uniqueAncestors = new Set(ancestors);
            if (ancestors.length > 0) {
                inbreedingSum += 1 - (uniqueAncestors.size / ancestors.length);
            }
        });
        const inbreedingCoeff = totalGoats > 0 ? inbreedingSum / totalGoats : 0;
        
        // Calculate average generation
        const avgGeneration = generations.reduce((a, b) => a + b, 0) / generations.length;
        
        // Count breeding lines (founder animals without parents)
        const breedingLines = this.goats.filter(g => !g.parents || (!g.parents.sire && !g.parents.dam)).length;
        
        return {
            geneticDiversity: Math.round(geneticDiversity),
            inbreedingCoeff,
            avgGeneration,
            breedingLines
        };
    }

    generateBreedingRecommendations() {
        const suggestionsContainer = document.getElementById('breeding-suggestions');
        if (!suggestionsContainer) return;

        const recommendations = this.calculateBreedingRecommendations();
        
        suggestionsContainer.innerHTML = recommendations.map(rec => `
            <div class="breeding-suggestion">
                <div class="suggestion-header">
                    <h4>${rec.title}</h4>
                    <span class="suggestion-score">${rec.score}% Match</span>
                </div>
                <div class="suggestion-details">${rec.details}</div>
            </div>
        `).join('');
    }

    calculateBreedingRecommendations() {
        const recommendations = [];
        const activeFemales = this.goats.filter(g => g.gender === 'Female' && g.breedingStatus === 'active');
        const activeMales = this.goats.filter(g => g.gender === 'Male' && g.breedingStatus === 'active');

        activeFemales.forEach(female => {
            let bestMatch = null;
            let bestScore = 0;

            activeMales.forEach(male => {
                const compatibility = this.calculateBreedingCompatibility(female, male);
                if (compatibility.score > bestScore) {
                    bestScore = compatibility.score;
                    bestMatch = male;
                }
            });

            if (bestMatch && bestScore >= 70) {
                recommendations.push({
                    title: `${female.name} × ${bestMatch.name}`,
                    score: bestScore,
                    details: `Recommended breeding pair for optimal genetic diversity. Expected offspring will have strong genetic foundation with ${bestScore}% compatibility score.`
                });
            }
        });

        // Add genetic diversity recommendations
        const breeds = [...new Set(this.goats.map(g => g.breed))];
        if (breeds.length === 1) {
            recommendations.push({
                title: 'Genetic Diversity Improvement',
                score: 85,
                details: 'Consider introducing a different breed to improve genetic diversity and hybrid vigor in your herd.'
            });
        }

        return recommendations.slice(0, 5); // Top 5 recommendations
    }

    // Utility Functions
    findGoat(searchTerm) {
        return this.goats.find(goat => 
            goat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goat.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    getParents(goat) {
        if (!goat.parents) return { sire: null, dam: null };
        
        return {
            sire: goat.parents.sire ? this.goats.find(g => g.id === goat.parents.sire) : null,
            dam: goat.parents.dam ? this.goats.find(g => g.id === goat.parents.dam) : null
        };
    }

    calculateAge(dob) {
        if (!dob) return 'Unknown';
        
        const today = new Date();
        const birthDate = new Date(dob);
        const diffTime = today - birthDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            return `${diffDays} days`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} months`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
        }
    }

    calculateAgeInMonths(dob) {
        if (!dob) return 0;
        const today = new Date();
        const birthDate = new Date(dob);
        const diffTime = today - birthDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    }

    getStatusIcon(status) {
        switch(status) {
            case 'active': return '🟢';
            case 'retired': return '🔴';
            case 'young': return '🟡';
            default: return '';
        }
    }

    showGoatDetails(goat) {
        this.selectedGoat = goat;
        const modal = document.getElementById('goat-detail-modal');
        
        // Populate modal with goat details
        document.getElementById('goat-detail-name').textContent = `${goat.name} (${goat.id})`;
        document.getElementById('detail-name').textContent = goat.name;
        document.getElementById('detail-id').textContent = goat.id;
        document.getElementById('detail-breed').textContent = goat.breed;
        document.getElementById('detail-gender').textContent = goat.gender;
        document.getElementById('detail-birth').textContent = goat.dob || 'Unknown';
        document.getElementById('detail-age').textContent = this.calculateAge(goat.dob);

        // Populate breeding history
        this.populateBreedingHistory(goat);
        
        // Populate offspring
        this.populateOffspring(goat);

        modal.style.display = 'block';
    }

    populateBreedingHistory(goat) {
        const container = document.getElementById('breeding-history-list');
        // This would typically come from breeding records
        container.innerHTML = '<div class="breeding-record">No breeding records found</div>';
    }

    populateOffspring(goat) {
        const container = document.getElementById('offspring-list');
        const offspring = this.goats.filter(g => 
            (g.parents?.sire === goat.id) || (g.parents?.dam === goat.id)
        );

        if (offspring.length === 0) {
            container.innerHTML = '<div class="offspring-card">No offspring recorded</div>';
            return;
        }

        container.innerHTML = offspring.map(child => `
            <div class="offspring-card" onclick="genealogyManager.showGoatDetails(genealogyManager.findGoat('${child.id}'))">
                <strong>${child.name}</strong>
                <div>${child.id}</div>
                <div>${child.gender}</div>
                <div>${this.calculateAge(child.dob)}</div>
            </div>
        `).join('');
    }

    searchGoats(searchTerm) {
        if (!searchTerm) {
            this.generateFamilyTree();
            return;
        }

        const filteredGoats = this.goats.filter(goat =>
            goat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goat.breed.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Re-render tree with filtered goats
        this.renderFilteredTree(filteredGoats);
    }

    renderFilteredTree(filteredGoats) {
        const treeContainer = document.getElementById('family-tree');
        if (!treeContainer) return;

        if (filteredGoats.length === 0) {
            treeContainer.innerHTML = `
                <div class="empty-tree">
                    <i class="fas fa-search"></i>
                    <h3>No Matching Goats</h3>
                    <p>Try a different search term</p>
                </div>
            `;
            return;
        }

        // Group by generation and render
        const generations = {};
        filteredGoats.forEach(goat => {
            const gen = goat.generation || 1;
            if (!generations[gen]) generations[gen] = [];
            generations[gen].push(goat);
        });

        this.renderFamilyTree(generations, treeContainer);
    }

    filterByGeneration(generation) {
        if (!generation) {
            this.generateFamilyTree();
            return;
        }

        const filteredGoats = this.goats.filter(goat => 
            goat.generation == generation
        );
        this.renderFilteredTree(filteredGoats);
    }

    filterByBreedingStatus(status) {
        if (!status) {
            this.generateFamilyTree();
            return;
        }

        const filteredGoats = this.goats.filter(goat => 
            goat.breedingStatus === status
        );
        this.renderFilteredTree(filteredGoats);
    }
}

// Global Functions
function generateFamilyTree() {
    genealogyManager.generateFamilyTree();
}

function generatePedigree() {
    genealogyManager.generatePedigree();
}

function expandAll() {
    document.querySelectorAll('.tree-node').forEach(node => {
        node.style.display = 'block';
    });
}

function collapseAll() {
    document.querySelectorAll('.tree-node').forEach((node, index) => {
        if (index > 5) { // Keep first 6 nodes visible
            node.style.display = 'none';
        }
    });
}

function exportTree() {
    // Export family tree as image or PDF
    alert('Export functionality would be implemented here');
}

function closeGoatDetailModal() {
    document.getElementById('goat-detail-modal').style.display = 'none';
}

function viewFullRecord() {
    if (genealogyManager.selectedGoat) {
        window.location.href = `farm-records.html?goat=${genealogyManager.selectedGoat.id}`;
    }
}

function logout() {
    localStorage.removeItem('farmRecordsAuth');
    window.location.href = 'index.html';
}

// Initialize when DOM is loaded
let genealogyManager;
document.addEventListener('DOMContentLoaded', function() {
    genealogyManager = new GenealogyManager();
});
