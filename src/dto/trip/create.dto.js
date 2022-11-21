import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import {
	dateTimeDTOSchema,
	dayDTOSchema,
	descriptionDTOSchema,
	idDTOSchema,
	meetPointDTOSchema,
	rateDTOSchema,
	toUniversityDTOSchema,
} from '../dtoTypes';

const TripCreateDTOSchema = Type.Object(
	{
		vehicle: idDTOSchema,
		date: dateTimeDTOSchema,
		day: dayDTOSchema,
		rate: rateDTOSchema,
		description: descriptionDTOSchema,
		toUniversity: toUniversityDTOSchema,
		meetPoint: meetPointDTOSchema,
	},
	{
		additionalProperties: false,
		errorMessage: {
			additionalProperties: 'El formato del objeto no es válido',
		},
	}
);

const ajv = new Ajv({ allErrors: true })
	.addKeyword('kind')
	.addKeyword('modifier');

addFormats(ajv, ['date-time']);
addErrors(ajv);

const validateSchema = ajv.compile(TripCreateDTOSchema);

//validate body
const tripCreateDTO = (req, res, next) => {
	const isDTOValid = validateSchema(req.body);

	if (!isDTOValid)
		return res.status(400).send({
			errors: validateSchema.errors.map(error => error.message),
		});

	next();
};

export default tripCreateDTO;
