const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');

/**
 * Report Service
 * Business logic for Data Analysis & Reporting
 * Implements Repository Pattern and SOLID principles
 */
class ReportService {
  /**
   * Generate appointment summary report
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {Object} generatedBy
   * @returns {Promise<Report>}
   */
  async generateAppointmentSummary(startDate, endDate, generatedBy) {
    try {
      const report = await Report.generateAppointmentSummary(
        startDate,
        endDate,
        generatedBy
      );

      // Log report generation
      await AuditLog.logAction({
        action: 'Report Generated',
        performedBy: generatedBy,
        entityType: 'Report',
        entityId: report._id,
        details: {
          reportType: 'Appointment Summary',
          dateRange: { startDate, endDate }
        },
        severity: 'Low',
        status: 'Success'
      });

      return report;
    } catch (error) {
      // Log failure
      await AuditLog.logAction({
        action: 'Report Generated',
        performedBy: generatedBy,
        details: {
          reportType: 'Appointment Summary',
          dateRange: { startDate, endDate }
        },
        severity: 'Medium',
        status: 'Failed',
        errorMessage: error.message
      });
      throw error;
    }
  }

  /**
   * Generate revenue report
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {Object} generatedBy
   * @returns {Promise<Report>}
   */
  async generateRevenueReport(startDate, endDate, generatedBy) {
    try {
      const report = await Report.generateRevenueReport(
        startDate,
        endDate,
        generatedBy
      );

      // Log report generation
      await AuditLog.logAction({
        action: 'Report Generated',
        performedBy: generatedBy,
        entityType: 'Report',
        entityId: report._id,
        details: {
          reportType: 'Revenue Report',
          dateRange: { startDate, endDate }
        },
        severity: 'Low',
        status: 'Success'
      });

      return report;
    } catch (error) {
      await AuditLog.logAction({
        action: 'Report Generated',
        performedBy: generatedBy,
        details: {
          reportType: 'Revenue Report',
          dateRange: { startDate, endDate }
        },
        severity: 'Medium',
        status: 'Failed',
        errorMessage: error.message
      });
      throw error;
    }
  }

  /**
   * Get all reports with filters
   * @param {Object} filters
   * @returns {Promise<Array<Report>>}
   */
  async getAllReports(filters = {}) {
    const query = {};
    
    if (filters.reportType) query.reportType = filters.reportType;
    if (filters.userId) query['generatedBy.userId'] = filters.userId;
    if (filters.status) query.status = filters.status;

    const reports = await Report.find(query)
      .sort({ generatedAt: -1 })
      .limit(50);

    return reports;
  }

  /**
   * Get report by ID
   * @param {String} reportId
   * @returns {Promise<Report>}
   */
  async getReportById(reportId) {
    const report = await Report.findById(reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }

    return report;
  }

  /**
   * Delete old reports (cleanup)
   * @returns {Promise<Number>} Number of deleted reports
   */
  async deleteExpiredReports() {
    const result = await Report.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    return result.deletedCount;
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>}
   */
  async getDashboardStatistics() {
    const Appointment = require('../models/Appointment');
    const Payment = require('../models/Payment');
    const Patient = require('../models/Patient');
    const Doctor = require('../models/Doctor');

    const [
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      totalPatients,
      activePatients,
      totalDoctors,
      todayRevenue
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({
        appointmentDate: { $gte: new Date() },
        status: { $in: ['Scheduled', 'Confirmed'] }
      }),
      Appointment.countDocuments({ status: 'Completed' }),
      Patient.countDocuments(),
      Patient.countDocuments({ isActive: true }),
      Doctor.countDocuments({ isActive: true }),
      Payment.aggregate([
        {
          $match: {
            paymentDate: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(23, 59, 59, 999))
            },
            status: 'Completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ])
    ]);

    // Get appointment trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const appointmentTrends = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      appointments: {
        total: totalAppointments,
        upcoming: upcomingAppointments,
        completed: completedAppointments
      },
      patients: {
        total: totalPatients,
        active: activePatients
      },
      doctors: {
        total: totalDoctors
      },
      revenue: {
        today: todayRevenue[0]?.total || 0
      },
      trends: {
        appointments: appointmentTrends
      }
    };
  }
}

module.exports = new ReportService();
