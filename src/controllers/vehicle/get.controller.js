import BrandVehicle from '../../schemas/brandVehicle.schema.js';
import TypeVehicle from '../../schemas/typeVehicle.schema.js';
import Vehicle from '../../schemas/vehicle.schema.js';

/**
 * Send vehicle { id, plate, available, type, brand } actives from database
 * @param {Object} req
 * @param {Object} res
 * @returns status and data
 */
export const getVehicles = async (req, res) => {
	const { id } = req;

	const data = await Vehicle.findAll({
		where: { active: true, BidderId: id },
		attributes: ['id', 'plate', 'available'],
		include: [
			{ model: TypeVehicle, attributes: ['description'] },
			{ model: BrandVehicle, attributes: ['description'] },
		],
	});

	return res.status(200).json(data);
};
