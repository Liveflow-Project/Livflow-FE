import { HttpResponse, http } from 'msw';

type IngredientsResponse = {
  all_ingredient: number;
  all_ingredient_cost: number;
  ingredients: IngredientDetailResponse[];
};

type IngredientDetailResponse = {
  ingredient_id: string; // UUID
  ingredient_name: string;
  ingredient_cost: number;
  capacity: number;
  unit: 'ml' | 'g' | 'ea';
  unit_cost: number;
  shop?: string;
  ingredient_detail?: string;
};

type IngredientsRequest = Omit<
  IngredientDetailResponse,
  'ingredient_id' | 'unit_cost'
>;

const STORE_IDS = {
  STORE_1: '0a6e3e2a-0bea-4cda-9f7d-9141ea5efa33',
  STORE_2: '1b7f4f3b-1cfb-5de4-0g8e-0252fb6efb44',
  STORE_3: 'a0b8035d-5499-4adb-9d8a-d7a93ac026e8',
};

const MOCK_INGREDIENTS_DETAIL: Record<string, IngredientDetailResponse[]> = {
  [STORE_IDS.STORE_1]: [
    {
      ingredient_id: crypto.randomUUID(),
      ingredient_name: '우유',
      ingredient_cost: 3500,
      capacity: 1000,
      unit: 'ml',
      unit_cost: 3.5,
      shop: '판매처',
      ingredient_detail: '기타',
    },
    {
      ingredient_id: crypto.randomUUID(),
      ingredient_name: '우유',
      ingredient_cost: 3500,
      capacity: 1000,
      unit: 'ml',
      unit_cost: 3.5,
      shop: '판매처',
      ingredient_detail: '기타',
    },
  ],

  [STORE_IDS.STORE_2]: [
    {
      ingredient_id: crypto.randomUUID(),
      ingredient_name: '우유',
      ingredient_cost: 3500,
      capacity: 1000,
      unit: 'ml',
      unit_cost: 3.5,
      shop: '판매처',
      ingredient_detail: '기타',
    },
    {
      ingredient_id: crypto.randomUUID(),
      ingredient_name: '우유',
      ingredient_cost: 3500,
      capacity: 1000,
      unit: 'ml',
      unit_cost: 3.5,
      shop: '판매처',
      ingredient_detail: '기타',
    },
  ],
  [STORE_IDS.STORE_3]: [
    {
      ingredient_id: crypto.randomUUID(),
      ingredient_name: '우유',
      ingredient_cost: 3500,
      capacity: 1000,
      unit: 'ml',
      unit_cost: 3.5,
      shop: '판매처',
      ingredient_detail: '기타',
    },
    {
      ingredient_id: crypto.randomUUID(),
      ingredient_name: '우유',
      ingredient_cost: 3500,
      capacity: 1000,
      unit: 'ml',
      unit_cost: 3.5,
      shop: '판매처',
      ingredient_detail: '기타',
    },
  ],
};

export const ingredientsHandler = [
  // 모든 재료 조회
  http.get('/ingredients/:storeId', ({ params }) => {
    const storeId = params.storeId as string;
    const ingredients = MOCK_INGREDIENTS_DETAIL[storeId];

    if (!ingredients) {
      return new HttpResponse(null, { status: 404 });
    }

    const response: IngredientsResponse = {
      all_ingredient: ingredients.length,
      all_ingredient_cost: ingredients.reduce(
        (sum, item) => sum + item.ingredient_cost,
        0
      ),
      ingredients: ingredients,
    };

    return HttpResponse.json(response);
  }),

  // 특정 재료 정보 조회
  http.get('/ingredients/:storeId/:ingredientsId', ({ params }) => {
    const storeId = params.storeId as string;
    const ingredients = MOCK_INGREDIENTS_DETAIL[storeId];

    if (!ingredients) {
      return new HttpResponse(null, { status: 404 });
    }

    const ingredient = ingredients.find(
      (item) => item.ingredient_id === params.ingredientsId
    );

    if (!ingredient) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(ingredient);
  }),

  // 재료 정보 추가
  http.post('/ingredients/:storeId', async ({ params, request }) => {
    const storeId = params.storeId as string;
    const newIngredient = (await request.json()) as IngredientsRequest;

    if (!MOCK_INGREDIENTS_DETAIL[storeId]) {
      MOCK_INGREDIENTS_DETAIL[storeId] = [];
    }

    const completeIngredient: IngredientDetailResponse = {
      ...newIngredient,
      ingredient_id: crypto.randomUUID(),
      unit_cost: newIngredient.ingredient_cost / newIngredient.capacity,
    };

    MOCK_INGREDIENTS_DETAIL[storeId].push(completeIngredient);

    return HttpResponse.json({
      success: true,
      data: newIngredient,
    });
  }),

  // 재료 정보 수정
  http.put(
    '/ingredients/:storeId/:ingredientsId',
    async ({ params, request }) => {
      const storeId = params.storeId as string;
      const ingredientId = params.ingredientsId as string;
      const updateData = (await request.json()) as IngredientsRequest;

      const ingredients = MOCK_INGREDIENTS_DETAIL[storeId];
      if (!ingredients) {
        return new HttpResponse(null, { status: 404 });
      }

      const index = ingredients.findIndex(
        (item) => item.ingredient_id === ingredientId
      );

      if (index === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      const updatedItem = {
        ...ingredients[index],
        ...updateData,
      };

      ingredients[index] = updatedItem;

      return HttpResponse.json({
        success: true,
        data: updatedItem,
      });
    }
  ),

  // 재료 정보 삭제
  http.delete('/ingredients/:storeId/:ingredientsId', ({ params }) => {
    const storeId = params.storeId as string;
    const ingredientId = params.ingredientsId as string;

    const ingredients = MOCK_INGREDIENTS_DETAIL[storeId];
    if (!ingredients) {
      return new HttpResponse(null, { status: 404 });
    }

    const filtered = ingredients.filter(
      (item) => item.ingredient_id !== ingredientId
    );

    if (filtered.length === ingredients.length) {
      return new HttpResponse(null, { status: 404 });
    }

    MOCK_INGREDIENTS_DETAIL[storeId] = filtered;

    return HttpResponse.json({
      success: true,
      message: '삭제되었습니다',
    });
  }),
];
