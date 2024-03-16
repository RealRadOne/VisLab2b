import { scatterplot } from './mdsplot.js';
import { clusterplot } from './mdscatter.js';
import { PCP } from './parallel.js';
import { cluster_PCP } from "./clustparallel.js";

document.addEventListener("DOMContentLoaded", function () {
    function renderMDSPlot() {
        fetch('/show_mds_data')
            .then(response => response.json())
            .then(data => {
                scatterplot(data);
            })
            .catch(error => {
                console.error('Error fetching MDS data:', error);
            });
    }

    function renderMDSClusterPlot() {
        fetch('/show_cluster_mds')
            .then(response => response.json())
            .then(data => {
                clusterplot(data);
            })
            .catch(error => {
                console.error('Error fetching cluster MDS data:', error);
            });
    }

    function renderPCPPlot() {
        fetch('/show_pcp_plot')
            .then(response => response.json())
            .then(data => {
                PCP(data);
            })
            .catch(error => {
                console.error('Error fetching PCP data:', error);
            });
    }

    function renderClusterPCP() {
        fetch('/show_cluster_pcp')
            .then(response => response.json())
            .then(data => {
                cluster_PCP(data);
            })
            .catch(error => {
                console.error('Error fetching cluster PCP data:', error);
            });
    }

    renderMDSPlot();
    renderMDSClusterPlot();
    renderPCPPlot();
    renderClusterPCP();
});
