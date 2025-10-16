const reportService = require('../services/reportService');

/**
 * Report Controller
 * Handles HTTP requests for Data Analysis & Reporting
 * Follows MVC pattern and SOLID principles
 */
class ReportController {
  /**
   * Generate appointment summary report
   * POST /api/reports/appointment-summary
   */
  async generateAppointmentSummary(req, res) {
    try {
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const generatedBy = {
        userId: req.body.userId || 'system',
        userName: req.body.userName || 'System',
        userType: req.body.userType || 'Admin'
      };

      const report = await reportService.generateAppointmentSummary(
        new Date(startDate),
        new Date(endDate),
        generatedBy
      );

      res.status(201).json({
        success: true,
        message: 'Appointment summary report generated successfully',
        data: report
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Generate revenue report
   * POST /api/reports/revenue
   */
  async generateRevenueReport(req, res) {
    try {
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const generatedBy = {
        userId: req.body.userId || 'system',
        userName: req.body.userName || 'System',
        userType: req.body.userType || 'Admin'
      };

      const report = await reportService.generateRevenueReport(
        new Date(startDate),
        new Date(endDate),
        generatedBy
      );

      res.status(201).json({
        success: true,
        message: 'Revenue report generated successfully',
        data: report
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all reports
   * GET /api/reports
   */
  async getAllReports(req, res) {
    try {
      const filters = {
        reportType: req.query.reportType,
        userId: req.query.userId,
        status: req.query.status
      };

      const reports = await reportService.getAllReports(filters);

      res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get report by ID
   * GET /api/reports/:id
   */
  async getReportById(req, res) {
    try {
      const report = await reportService.getReportById(req.params.id);

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get dashboard statistics
   * GET /api/reports/dashboard
   */
  async getDashboardStatistics(req, res) {
    try {
      const statistics = await reportService.getDashboardStatistics();

      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete expired reports
   * DELETE /api/reports/cleanup
   */
  async deleteExpiredReports(req, res) {
    try {
      const deletedCount = await reportService.deleteExpiredReports();

      res.status(200).json({
        success: true,
        message: `${deletedCount} expired reports deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ReportController();
