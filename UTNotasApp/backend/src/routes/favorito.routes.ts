import { Router } from 'express';
import * as favoritoController from '../controllers/favorito.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Requiere token — listado paginado de materiales favoritos del usuario autenticado
router.get('/',
	authenticate,
	favoritoController.findFavoritos,
);

// Requiere token — favorito propio del usuario autenticado sobre el material
router.get('/:materialId',
	authenticate,
	favoritoController.getFavoritoByMaterialAndUser,
);

// Requiere token — marca o desmarca el material como favorito del usuario autenticado
router.post('/:materialId',
	authenticate,
	favoritoController.toggleFavorito,
);

export const favoritoRoutes = router;
